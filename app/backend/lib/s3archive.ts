import { Router } from 'express';
import archiver from 'archiver';
import { DateTime } from 'luxon';
import archivePaths from '../../data/archivePaths';
import config from '../../config';
import s3Client from './s3client';
import getAuthRole from '../../utils/getAuthRole';
import { performQuery } from './graphql';

const getApplicationsQuery = `
query getApplications {
  allApplications {
    nodes {
      formData {
        jsonData
      }
      ccbcNumber
      projectName
      organizationName
      status
    }
  }
}
`;

const AWS_S3_BUCKET = config.get('AWS_S3_BUCKET');

const s3archive = Router();

s3archive.get('/api/analyst/archive', async (req, res) => {
  const currentDate = DateTime.now().toFormat('yyyyMMdd');
  const authRole = getAuthRole(req);
  const isRoleAuthorized =
    authRole?.pgRole === 'ccbc_admin' || authRole?.pgRole === 'ccbc_analyst';
  if (!isRoleAuthorized) return;

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

  const archive = archiver('zip');

  // Handle various events
  archive.on('end', () => {});
  archive.on('warning', () => {});
  archive.on('error', () => {});

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
        const path = archivePaths[field].path(ccbcNumber, name);

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

  archive.finalize();
});

export default s3archive;
