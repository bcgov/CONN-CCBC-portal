import * as Sentry from '@sentry/nextjs';
import config from '../../config';
import getArchivePath from '../../utils/getArchivePath';
import { getFileTagging } from './s3client';
import { performQuery } from './graphql';

const AWS_S3_BUCKET = config.get('AWS_S3_BUCKET');
const INFECTED_FILE_PREFIX = 'BROKEN';
const checkTags = config.get('CHECK_TAGS');

const getApplicationsQuery = `
query getApplications($intakeId: Int!) {
  allApplications(condition:  {intakeId: $intakeId}) {
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

const formatAttachments = (formData) => {
  return {
    // We were spreading each form page though some files were going missing so we are spreading each field separately

    // template uploads
    eligibilityAndImpactsCalculator:
      formData?.templateUploads?.eligibilityAndImpactsCalculator,
    detailedBudget: formData?.templateUploads?.detailedBudget,
    financialForecast: formData?.templateUploads?.financialForecast,
    lastMileIspOffering: formData?.templateUploads?.lastMileIspOffering,
    popWholesalePricing: formData?.templateUploads?.popWholesalePricing,
    communityRuralDevelopmentBenefitsTemplate:
      formData?.templateUploads?.communityRuralDevelopmentBenefitsTemplate,
    wirelessAddendum: formData?.templateUploads?.wirelessAddendum,
    supportingConnectivityEvidence:
      formData?.templateUploads?.supportingConnectivityEvidence,
    geographicNames: formData?.templateUploads?.geographicNames,
    equipmentDetails: formData?.templateUploads?.equipmentDetails,

    // supporting documents
    copiesOfRegistration: formData?.supportingDocuments?.copiesOfRegistration,
    preparedFinancialStatements:
      formData?.supportingDocuments?.preparedFinancialStatements,
    logicalNetworkDiagram: formData?.supportingDocuments?.logicalNetworkDiagram,
    projectSchedule: formData?.supportingDocuments?.projectSchedule,
    communityRuralDevelopmentBenefits:
      formData?.supportingDocuments?.communityRuralDevelopmentBenefits,
    otherSupportingMaterials:
      formData?.supportingDocuments?.otherSupportingMaterials,

    // coverage
    geographicCoverageMap: formData?.coverage?.geographicCoverageMap,
    coverageAssessmentStatistics:
      formData?.coverage?.coverageAssessmentStatistics,
    currentNetworkInfastructure:
      formData?.coverage?.currentNetworkInfastructure,
    upgradedNetworkInfrastructure:
      formData?.coverage?.upgradedNetworkInfrastructure,
  };
};

const getAttachmentList = async (intake: number, req) => {
  const infected = [];
  const attachments = [];
  // untility functions
  const detectInfected = async (uuid: string) => {
    const params = {
      Bucket: AWS_S3_BUCKET,
      Key: uuid,
    };
    const getTags = await getFileTagging(params);
    return getTags;
  };
  const markAllInfected = async (formData) => {
    const attachmentFields = formatAttachments(formData);
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
    const attachmentFields = formatAttachments(formData);

    // Iterate through fields
    Object.keys(attachmentFields)?.forEach((field) => {
      // Even fields single file uploads are stored in an array so we will iterate them
      if (attachmentFields[field] instanceof Array) {
        attachmentFields[field]?.forEach((attachment) => {
          const { name, uuid, size, type } = attachment;
          const path = getArchivePath(field, ccbcNumber, name);
          if (infected.indexOf(uuid) > -1) {
            attachments.push({
              name: `${INFECTED_FILE_PREFIX}_${path}`,
              uuid,
              size,
              type,
              ccbcId: ccbcNumber,
            });
          } else {
            attachments.push({
              name: path,
              uuid,
              size,
              type,
              ccbcId: ccbcNumber,
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

  const allApplications = await performQuery(
    getApplicationsQuery,
    { intakeId: intake },
    req
  );
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

  applications.forEach((application) => {
    const jsonData = application?.formData?.jsonData;
    const ccbcId = application?.ccbcNumber;
    sortAndAppendAttachments(jsonData, ccbcId, application?.formData?.rowId);
  });
  return attachments;
};

export default getAttachmentList;
