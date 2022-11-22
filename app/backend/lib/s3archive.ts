import { Router } from 'express';
import archiver from 'archiver';
import * as Sentry from '@sentry/nextjs';
import { DateTime } from 'luxon';
import config from '../../config';
import getArchivePath from '../../utils/getArchivePath';
import getAuthRole from '../../utils/getAuthRole';
import s3Client from './s3client';
import { performQuery } from './graphql';

const getApplicationsQuery = `
query getApplications {
  allApplications {
    nodes {
      formData {
        jsonData
      }
      ccbcNumber
    }
  }
}
`;

const AWS_S3_BUCKET = config.get('AWS_S3_BUCKET');
const SENTRY_ENVIRONMENT = config.get('SENTRY_ENVIRONMENT');

const s3archive = Router();

// eslint-disable-next-line consistent-return
s3archive.get('/api/analyst/archive', async (req, res) => {
  const currentDate = DateTime.now().toFormat('yyyyMMdd');
  const authRole = getAuthRole(req);
  const isRoleAuthorized =
    authRole?.pgRole === 'ccbc_admin' || authRole?.pgRole === 'ccbc_analyst';
  if (!isRoleAuthorized) {
    return res.status(404).end();
  }

  res.writeHead(200, {
    'Content-Type': 'application/zip',
    'Content-disposition': `attachment; filename=CCBC applications ${currentDate}.zip`,
  });

  const allApplications = await performQuery(getApplicationsQuery, {}, req);
  if (allApplications.errors) {
    throw new Error(
      `Failed to retrieve form data:\n${allApplications.errors.join('\n')}`
    );
  }

  const applications = allApplications.data.allApplications.nodes;

  const archive = archiver('zip', { zlib: { level: 0 } });

  if (SENTRY_ENVIRONMENT) {
    archive.on('error', (err) => {
      Sentry.captureException(err);
    });
  }

  // Send the archive to the route
  archive.pipe(res);

  const sortAndAppendAttachments = (formData, ccbcNumber) => {
    const attachmentFields = {
      ...formData?.templateUploads,
      ...formData?.supportingDocuments,
      ...formData?.coverage,
    };

    // Iterate through fields
    Object.keys(attachmentFields).forEach((field) => {
      // Even fields single file uploads are stored in an array so we will iterate them
      attachmentFields[field].forEach((attachment) => {
        const { name, uuid } = attachment;
        const path = getArchivePath(field, ccbcNumber, name);

        // Get object from s3
        const objectSrc = s3Client
          .getObject({
            Bucket: AWS_S3_BUCKET,
            Key: uuid,
          })
          .createReadStream();

        archive.append(objectSrc, {
          name: path,
        });
      });
    });
  };

  applications.forEach((application) => {
    const jsonData = application?.formData?.jsonData;
    const ccbcId = application?.ccbcNumber;
    sortAndAppendAttachments(jsonData, ccbcId);
  });

  return archive.finalize();
});

export default s3archive;
