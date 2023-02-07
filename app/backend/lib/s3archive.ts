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
        rowId
        jsonData
      }
      ccbcNumber
    }
  }
}
`;

const AWS_S3_BUCKET = config.get('AWS_S3_BUCKET');
const SENTRY_ENVIRONMENT = config.get('SENTRY_ENVIRONMENT');
const INFECTED_FILE_PREFIX = 'BROKEN';
const checkTags = config.get('CHECK_TAGS');

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
  const infected = [];

  res.writeHead(200, {
    'Content-Type': 'application/zip',
    'Content-disposition': `attachment; filename=CCBC applications ${currentDate}.zip`,
  });

  const archive = archiver('zip', { zlib: { level: 0 } });

  // untility functions
  const detectInfected = async (uuid: string) => {
    const params = {
      Bucket: AWS_S3_BUCKET,
      Key: uuid,
    };
    const getTags = await s3Client.getObjectTagging(params).promise();
    return getTags;
  };
  const markAllInfected = async (formData) => {
    const attachmentFields = {
      ...formData?.templateUploads,
      ...formData?.supportingDocuments,
      ...formData?.coverage,
    };
    /**
     * {
     * templateUploads: null
     * }
     */

    // Iterate through fields
    Object.keys(attachmentFields)?.forEach((field) => {
      // Even fields single file uploads are stored in an array so we will iterate them
      if (Array.isArray(attachmentFields[field])) {
        attachmentFields[field]?.forEach(async (attachment) => {
          const { uuid } = attachment;
          const healthCheck = await detectInfected(uuid);
          const suspect = healthCheck.TagSet.find((x) => x.Key === 'av-status');
          if (suspect?.Value === 'dirty') {
            infected.push(uuid);
          }
        });
      } else {
        Sentry.captureException(
          new Error(`non-array data in form_data: ${formData.rowId}`)
        );
      }
    });
  };
  const sortAndAppendAttachments = (formData, ccbcNumber, formDataRowId) => {
    const attachmentFields = {
      ...formData?.templateUploads,
      ...formData?.supportingDocuments,
      ...formData?.coverage,
    };

    // Iterate through fields
    Object.keys(attachmentFields)?.forEach((field) => {
      // Even fields single file uploads are stored in an array so we will iterate them
      if (attachmentFields[field] instanceof Array) {
        attachmentFields[field]?.forEach((attachment) => {
          const { name, uuid } = attachment;
          const path = getArchivePath(field, ccbcNumber, name);
          if (infected.indexOf(uuid) > -1) {
            archive.append('', {
              name: `${INFECTED_FILE_PREFIX}_${path}`,
            });
          } else {
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
          }
        });
      } else {
        Sentry.captureException(
          new Error(`non-array data in form_data: ${formDataRowId}`)
        );
      }
    });
  };

  const allApplications = await performQuery(getApplicationsQuery, {}, req);
  if (allApplications.errors) {
    throw new Error(
      `Failed to retrieve form data:\n${allApplications.errors.join('\n')}`
    );
  }

  const applications = allApplications.data.allApplications.nodes;

  if (checkTags) {
    await Promise.all(
      applications.map(async (application) => {
        const jsonData = application?.formData?.jsonData;
        await markAllInfected(jsonData);
      })
    );
  }

  if (SENTRY_ENVIRONMENT) {
    archive.on('error', (err) => {
      Sentry.captureException(err);
    });
  }

  // Send the archive to the route
  archive.pipe(res);

  applications.forEach((application) => {
    const jsonData = application?.formData?.jsonData;
    const ccbcId = application?.ccbcNumber;
    sortAndAppendAttachments(jsonData, ccbcId, application?.formData?.rowId);
  });

  return archive.finalize();
});

export default s3archive;
