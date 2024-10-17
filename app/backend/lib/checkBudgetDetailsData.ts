/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import { Router } from 'express';

import { GetObjectCommand } from '@aws-sdk/client-s3';
import * as XLSX from 'xlsx';
import config from '../../config';
import { s3ClientV3 } from './s3client';
import { performQuery } from './graphql';
import readTemplateOneData from './excel_import/template_one';
import readTemplateTwoData from './excel_import/template_two';

const AWS_S3_DATA_BUCKET = config.get('AWS_S3_BUCKET');
// const AWS_S3_SECRET_KEY = config.get('AWS_S3_SECRET_KEY');

const checkBudgetDetails = Router();

const getApplicationsQuery = `
query getApplications {
  allApplications(
    orderBy: CCBC_NUMBER_DESC
    filter: {
      status: {
        inInsensitive: [
          "received"
          "applicant_received"
          "screening"
          "assessment"
          "recommendation"
          "conditionally_approved"
          "applicant_conditionally_approved"
          "applicant_approved"
          "approved"
          "applicant_complete"
          "applicant_on_hold"
          "complete"
          "applicant_cancelled"
          "applicant_closed"
          "on_hold"
          "cancelled"
        ]
      }
    }
  ) {
    nodes {
      formData {
        rowId
        jsonData
      }
      rfiDataByApplicationRfiDataApplicationIdAndRfiDataId(orderBy: UPDATED_BY_DESC) {
        nodes {
          jsonData
        }
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

const formatBudgetDetails = (formData) => {
  return {
    totalEligibleCosts: formData?.budgetDetails?.totalEligibleCosts,
    totalProjectCost: formData?.budgetDetails?.totalProjectCost,
  };
};

const formatHouseholdDetails = (formData) => {
  return {
    numberOfHouseholds: formData?.benefits?.numberOfHouseholds,
    householdsImpactedIndigenous:
      formData?.benefits?.householdsImpactedIndigenous,
  };
};

const formatRfiBudgetAttachments = (node) => {
  const applicationRfis =
    node.rfiDataByApplicationRfiDataApplicationIdAndRfiDataId.nodes;

  const rfiBudgetAttachments = applicationRfis
    ?.flatMap((rfi) => {
      if (rfi.jsonData?.rfiAdditionalFiles?.detailedBudget) {
        return rfi.jsonData.rfiAdditionalFiles.detailedBudget;
      }
      return null;
    })
    .filter((attachment) => attachment !== null);
  return rfiBudgetAttachments;
};

const formatHouseholdNumberAttachments = (node) => {
  const applicationRfis =
    node.rfiDataByApplicationRfiDataApplicationIdAndRfiDataId.nodes;

  const householdNumberAttachments = applicationRfis
    ?.flatMap((rfi) => {
      if (rfi.jsonData?.rfiAdditionalFiles?.eligibilityAndImpactsCalculator) {
        return rfi.jsonData.rfiAdditionalFiles.eligibilityAndImpactsCalculator;
      }
      return null;
    })
    .filter((attachment) => attachment !== null);
  return householdNumberAttachments;
};

interface AttachmentInfo {
  attachments: ReturnType<typeof formatAttachments>;
  ccbcNumber: string;
  budgetDetails: ReturnType<typeof formatBudgetDetails>;
  householdDetails: ReturnType<typeof formatHouseholdDetails>;
  rfiBudgetDetails: FileMetaDetails[];
  rfiHouseholdDetails: FileMetaDetails[];
}

interface FileMetaDetails {
  uuid: string;
  name: string;
  size: number;
  type: string;
}

const asdf = (node: any): AttachmentInfo => {
  return {
    attachments: formatAttachments(node.formData.jsonData),
    ccbcNumber: node.ccbcNumber,
    budgetDetails: formatBudgetDetails(node.formData.jsonData),
    householdDetails: formatHouseholdDetails(node.formData.jsonData),
    rfiBudgetDetails: formatRfiBudgetAttachments(node),
    rfiHouseholdDetails: formatHouseholdNumberAttachments(node),
  };
};

checkBudgetDetails.get('/api/checkBudgetDetails', async (req, res) => {
  const allApplications = await performQuery(getApplicationsQuery, {}, req);

  const data = [];
  // console.log(JSON.stringify(allApplications, null, 2));

  const attachments: AttachmentInfo[] =
    allApplications.data.allApplications.nodes.map(asdf);

  for (const attachment of attachments) {
    const budgetDetails = attachment.attachments.detailedBudget;
    const houseHolds = attachment.attachments.eligibilityAndImpactsCalculator;
    const budgetDetailsFile = (budgetDetails && budgetDetails[0]) as
      | FileMetaDetails
      | undefined;
    const houseHoldsFile = (houseHolds && houseHolds[0]) as
      | FileMetaDetails
      | undefined;

    if (budgetDetailsFile) {
      const getObjCommand = new GetObjectCommand({
        Bucket: AWS_S3_DATA_BUCKET,
        Key: budgetDetailsFile.uuid,
      });
      const s3Response = await s3ClientV3.send(getObjCommand);

      const buf = await s3Response.Body?.transformToByteArray();

      const wb = XLSX.read(buf);
      const templateTwoData = readTemplateTwoData(wb);
      console.log(attachment.budgetDetails, templateTwoData);
      if (
        templateTwoData?.totalEligibleCosts !==
          attachment.budgetDetails?.totalEligibleCosts ||
        templateTwoData?.totalProjectCosts !==
          attachment.budgetDetails?.totalProjectCost
      ) {
        data.push(
          // `${attachment.ccbcNumber} has mismatched budget details in application`
          {
            ccbcNumber: attachment.ccbcNumber,
            matching: false,
            message: `${attachment.ccbcNumber} has mismatched budget details in application`,
            templateTwoData,
            formDataBudgetDetails: attachment.budgetDetails,
          }
        );
        if (attachment.rfiBudgetDetails.length > 0) {
          console.log(attachment.rfiBudgetDetails);
          for (const rfiBudget of attachment.rfiBudgetDetails) {
            const rfiBudgetGetObjCommand = new GetObjectCommand({
              Bucket: AWS_S3_DATA_BUCKET,
              Key: rfiBudget.uuid,
            });
            const rfiBudgetS3Response = await s3ClientV3.send(
              rfiBudgetGetObjCommand
            );
            const rfiBudgetBuf =
              await rfiBudgetS3Response.Body?.transformToByteArray();
            const rfiBudgetWB = XLSX.read(rfiBudgetBuf);
            const templateTwoRfiData = readTemplateTwoData(rfiBudgetWB);
            if (
              templateTwoRfiData?.totalEligibleCosts !==
                attachment.budgetDetails?.totalEligibleCosts ||
              templateTwoRfiData?.totalProjectCosts !==
                attachment.budgetDetails?.totalProjectCost
            ) {
              data.push(
                // `${attachment.ccbcNumber} has mismatched budget details in RFI file ${rfiBudget.name}`
                {
                  ccbcNumber: attachment.ccbcNumber,
                  matching: false,
                  message: `${attachment.ccbcNumber} has mismatched budget details in RFI file ${rfiBudget.name}`,
                  templateTwoData: templateTwoRfiData,
                  formDataBudgetDetails: attachment.budgetDetails,
                }
              );
            } else if (
              templateTwoRfiData?.totalEligibleCosts ===
                attachment.budgetDetails?.totalEligibleCosts &&
              templateTwoRfiData?.totalProjectCosts ===
                attachment.budgetDetails?.totalProjectCost
            ) {
              data.push(
                // `${attachment.ccbcNumber} has matched budget details in RFI file ${rfiBudget.name}`
                {
                  ccbcNumber: attachment.ccbcNumber,
                  matching: true,
                  message: `${attachment.ccbcNumber} has matched budget details in RFI file ${rfiBudget.name}`,
                }
              );
            }
          }
        }
      }
    }
    if (houseHoldsFile) {
      const houseHoldsGetObjCommand = new GetObjectCommand({
        Bucket: AWS_S3_DATA_BUCKET,
        Key: houseHoldsFile.uuid,
      });
      const houseHoldsS3Response = await s3ClientV3.send(
        houseHoldsGetObjCommand
      );

      const houseHoldsBuf =
        await houseHoldsS3Response.Body?.transformToByteArray();

      const houseHoldsWB = XLSX.read(houseHoldsBuf);
      const templateOneData = readTemplateOneData(houseHoldsWB);
      console.log(attachment.householdDetails, templateOneData);
      if (
        templateOneData?.finalEligibleHouseholds !==
          attachment.householdDetails?.numberOfHouseholds ||
        templateOneData?.totalNumberHouseholdsImpacted !==
          attachment.householdDetails?.householdsImpactedIndigenous
      ) {
        console.log('mismatch household');
        data.push(
          // `${attachment.ccbcNumber} has mismatched household details`
          {
            ccbcNumber: attachment.ccbcNumber,
            matching: false,
            message: `${attachment.ccbcNumber} has mismatched household details`,
            templateOneData,
            formDataHouseholdDetails: attachment.householdDetails,
          }
        );
        if (attachment.rfiHouseholdDetails.length > 0) {
          console.log(attachment.rfiHouseholdDetails);
          for (const rfiHouseholdDetails of attachment.rfiHouseholdDetails) {
            const rfiHouseholdGetObjCommand = new GetObjectCommand({
              Bucket: AWS_S3_DATA_BUCKET,
              Key: rfiHouseholdDetails.uuid,
            });
            const rfiHouseholdResponse = await s3ClientV3.send(
              rfiHouseholdGetObjCommand
            );
            const rfiBudgetBuf =
              await rfiHouseholdResponse.Body?.transformToByteArray();
            const rfiHouseholdWB = XLSX.read(rfiBudgetBuf);
            const templateOneRfiHouseholdData =
              readTemplateOneData(rfiHouseholdWB);
            if (
              templateOneRfiHouseholdData?.finalEligibleHouseholds !==
                attachment.householdDetails?.numberOfHouseholds ||
              templateOneRfiHouseholdData?.totalNumberHouseholdsImpacted !==
                attachment.householdDetails?.householdsImpactedIndigenous
            ) {
              data.push(
                // `${attachment.ccbcNumber} has mismatched budget details in RFI file ${rfiHouseholdDetails.name}`
                {
                  ccbcNumber: attachment.ccbcNumber,
                  message: `${attachment.ccbcNumber} has mismatched budget details in RFI file ${rfiHouseholdDetails.name}`,
                  matching: false,
                  templateOneData: templateOneRfiHouseholdData,
                  formDataHouseholdDetails: attachment.householdDetails,
                }
              );
            } else if (
              templateOneRfiHouseholdData?.finalEligibleHouseholds ===
                attachment.householdDetails?.numberOfHouseholds &&
              templateOneRfiHouseholdData?.totalNumberHouseholdsImpacted ===
                attachment.householdDetails?.householdsImpactedIndigenous
            ) {
              data.push(
                // `${attachment.ccbcNumber} has matched budget details in RFI file ${rfiHouseholdDetails.name}`
                {
                  ccbcNumber: attachment.ccbcNumber,
                  message: `${attachment.ccbcNumber} has matched budget details in RFI file ${rfiHouseholdDetails.name}`,
                  matching: true,
                }
              );
            }
          }
        }
      }
    }
  }
  const matching = data
    .filter((d) => d.matching === true)
    .map((d) => d.ccbcNumber);
  const mismatching = data.filter((d) => !matching.includes(d.ccbcNumber));
  console.log('data', data);
  res.status(200).json({ mismatching }).end();
});

export default checkBudgetDetails;
