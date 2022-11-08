/* eslint-disable @typescript-eslint/no-unused-vars */

const COVERAGE = 'Step 1 - Eligibility Mapping & Statistics';
const TEMPLATE_UPLOADS = 'Step 2 - Templates';
const SUPPORTING_DOCUMENTS = 'Step 4 - Supporting Documents';

const archivePaths = {
  // Template Uploads
  eligibilityAndImpactsCalculator: {
    path: (ccbcId: string, fileName: string) => {
      return `/${ccbcId}/${TEMPLATE_UPLOADS}/${ccbcId} - Template 1`;
    },
  },
  detailedBudget: {
    path: (ccbcId: string, fileName: string) => {
      return `/${ccbcId}/${TEMPLATE_UPLOADS}/${ccbcId} - Template 2`;
    },
  },
  financialForecast: {
    path: (ccbcId: string, fileName: string) => {
      return `/${ccbcId}/${TEMPLATE_UPLOADS}/${ccbcId} - Template 3`;
    },
  },
  lastMileIspOffering: {
    path: (ccbcId: string, fileName: string) => {
      return `/${ccbcId}/${TEMPLATE_UPLOADS}/${ccbcId} - Template 4`;
    },
  },
  popWholesalePricing: {
    path: (ccbcId: string, fileName: string) => {
      return `/${ccbcId}/${TEMPLATE_UPLOADS}/${ccbcId} - Template 5`;
    },
  },
  communityRuralDevelopmentBenefitsTemplate: {
    path: (ccbcId: string, fileName: string) => {
      return `/${ccbcId}/${TEMPLATE_UPLOADS}/${ccbcId} - Template 6`;
    },
  },
  wirelessAddendum: {
    path: (ccbcId: string, fileName: string) => {
      return `/${ccbcId}/${TEMPLATE_UPLOADS}/${ccbcId} - Template 7`;
    },
  },
  supportingConnectivityEvidence: {
    path: (ccbcId: string, fileName: string) => {
      return `/${ccbcId}/${TEMPLATE_UPLOADS}/${ccbcId} - Template 8`;
    },
  },
  geographicNames: {
    path: (ccbcId: string, fileName: string) => {
      return `/${ccbcId}/${TEMPLATE_UPLOADS}/${ccbcId} - Template 9`;
    },
  },
  equipmentDetails: {
    path: (ccbcId: string, fileName: string) => {
      return `/${ccbcId}/${TEMPLATE_UPLOADS}/${ccbcId} - Template 10`;
    },
  },
  // Supporting Documents
  copiesOfRegistration: {
    path: (ccbcId: string, fileName: string) => {
      return `/${ccbcId}/${SUPPORTING_DOCUMENTS}/Incorporation documents/${ccbcId} - ${fileName}`;
    },
  },
  preparedFinancialStatements: {
    path: (ccbcId: string, fileName: string) => {
      return `/${ccbcId}/${SUPPORTING_DOCUMENTS}/Independently prepared financial statements/${ccbcId} - ${fileName}`;
    },
  },
  logicalNetworkDiagram: {
    path: (ccbcId: string, fileName: string) => {
      return `/${ccbcId}/${SUPPORTING_DOCUMENTS}/Logical network diagram/${ccbcId} - ${fileName}`;
    },
  },
  projectSchedule: {
    path: (ccbcId: string, fileName: string) => {
      return `/${ccbcId}/${SUPPORTING_DOCUMENTS}/Project schedule (Gantt chart)/${ccbcId} - ${fileName}`;
    },
  },
  communityRuralDevelopmentBenefits: {
    path: (ccbcId: string, fileName: string) => {
      return `/${ccbcId}/${SUPPORTING_DOCUMENTS}/Supporting documents for benefits/${ccbcId} - ${fileName}`;
    },
  },
  otherSupportingMaterials: {
    path: (ccbcId: string, fileName: string) => {
      return `/${ccbcId}/${SUPPORTING_DOCUMENTS}/Other supporting documents/${ccbcId} - ${fileName}`;
    },
  },
  // Coverage
  geographicCoverageMap: {
    path: (ccbcId: string, fileName: string) => {
      return `/${ccbcId}/${COVERAGE}/Coverage map/${ccbcId} - ${fileName}`;
    },
  },
  coverageAssessmentStatistics: {
    path: (ccbcId: string, fileName: string) => {
      return `/${ccbcId}/${COVERAGE}/Statistics email confirmation/${ccbcId} - ${fileName}`;
    },
  },
  currentNetworkInfastructure: {
    path: (ccbcId: string, fileName: string) => {
      return `/${ccbcId}/${COVERAGE}/Current network infrastructure/${ccbcId} - ${fileName}`;
    },
  },
  upgradedNetworkInfrastructure: {
    path: (ccbcId: string, fileName: string) => {
      return `/${ccbcId}/${COVERAGE}/Upgraded network infrastructure/${ccbcId} - ${fileName}`;
    },
  },
};

export default archivePaths;
