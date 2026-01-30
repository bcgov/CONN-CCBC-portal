import { Router } from 'express';

import config from '../../config';
import getAuthRole from '../../utils/getAuthRole';
import { checkFileExists, getFileFromS3, uploadFileToS3 } from './s3client';
import getAttachmentList from './attachments';
import getLastIntakeId from './lastIntake';
import getIntakeId from './intakeId';
import { performQuery } from './graphql';

const AWS_S3_CLAM_BUCKET = config.get('AWS_CLAM_S3_BUCKET');
const AWS_S3_DATA_BUCKET = config.get('AWS_S3_BUCKET');
const AWS_S3_SECRET_KEY = config.get('AWS_S3_SECRET_KEY');

const s3adminArchive = Router();

const getApplicationsQuery = `
query getApplications($intakeId: Int!) {
  allApplications(
    condition: {intakeId: $intakeId}
    orderBy: CCBC_NUMBER_DESC
    filter: {status: {notEqualTo: "draft"}}
  ) {
    nodes {
      formData {
        rowId
        jsonData
      }
      ccbcNumber
      applicationStatusesByApplicationId(
        orderBy: CREATED_AT_DESC,
        first: 1,
        filter: {status: {equalTo: "received"}}
      ){
        nodes {
          createdAt
          status
        }
      }
    }
  }
}
`;

// check if new applications have been received since last request to generate zip
// for rolling intake
const regenerateForRollingIntake = (
  allApplications,
  lastRequestAt,
  isRollingIntake
) => {
  const applications = allApplications.data.allApplications.nodes;
  const latestSubmit =
    applications?.[0]?.applicationStatusesByApplicationId?.nodes?.[0].createdAt;

  const isNewApplicationsReceived =
    latestSubmit && lastRequestAt
      ? new Date(latestSubmit) > new Date(lastRequestAt)
      : false;

  return isRollingIntake && isNewApplicationsReceived;
};

// eslint-disable-next-line consistent-return
s3adminArchive.get('/api/analyst/admin-archive/:intake', async (req, res) => {
  const authRole = getAuthRole(req);
  const isRoleAuthorized =
    authRole?.pgRole === 'ccbc_admin' || authRole?.pgRole === 'super_admin';
  if (!isRoleAuthorized) {
    // check header
    const apiKey = req.headers['x-api-key'];
    if (apiKey !== AWS_S3_SECRET_KEY) {
      return res.status(404).end();
    }
    req.claims = {
      identity_provider: 'idir',
      client_roles: ['admin'],
      aud: 'ccbc',
      exp: 0,
      iat: 0,
      iss: 'ccbc',
      sub: 'ccbc',
    };
  }
  let { intake } = req.params;
  const { isRollingIntake } = req.query;
  let intakeNumber = intake;
  if (intake === '-1') {
    const latest = await getLastIntakeId(req);
    intake = latest?.intakeId;
    intakeNumber = latest?.intakeNumber;
  } else {
    const selected = await getIntakeId(req);
    intake = selected?.intakeId;
    intakeNumber = selected?.intakeNumber ?? intakeNumber;
  }
  if (intake === '-1') {
    throw new Error('Wrong intake id');
  }
  const s3Key = `Intake_${intakeNumber}_attachments`;
  const s3params = {
    Bucket: AWS_S3_DATA_BUCKET,
    Key: `${s3Key}.zip`,
  };
  const allApplications = await performQuery(
    getApplicationsQuery,
    { intakeId: parseInt(intake as string, 10) },
    req
  );

  const { alreadyExists, requestedAt } = await checkFileExists(s3params);
  if (
    alreadyExists &&
    !regenerateForRollingIntake(allApplications, requestedAt, isRollingIntake)
  ) {
    await getFileFromS3(s3params.Key, s3params.Key, res);
    return res.status(200).end();
  }
  // turn ccbc intake number into intake id
  // as some intakes had id which did not match their intake number
  const attachments = await getAttachmentList(allApplications);

  const fileName = `${s3Key}.json`;
  // The Lambda function only triggers on json uploads to the
  // s3 clamav bucket
  // metadata is used to store the requested-at timestamp to determine regenerating of rolling intake zip
  const params = {
    Bucket: AWS_S3_CLAM_BUCKET,
    Key: fileName,
    Body: JSON.stringify(attachments),
    Metadata: {
      'requested-at': new Date().toISOString(),
    },
  };
  const response = await uploadFileToS3(params);
  res.send(response);
  return res.status(200).end();
});

export default s3adminArchive;
