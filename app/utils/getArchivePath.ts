const COVERAGE = 'Step 1 - Eligibility Mapping & Statistics';
const TEMPLATE_UPLOADS = 'Step 2 - Templates';
const SUPPORTING_DOCUMENTS = 'Step 4 - Supporting Documents';

/*
Paths for the folder structure of our s3 zip archive

Supported variables which get replaced in the path are:
  $id: the CCBC id assigned to an application when it is submitted
  $fileName: the name of the file
*/

const archivePaths = {
  // Template Uploads
  eligibilityAndImpactsCalculator: {
    path: `/$id/${TEMPLATE_UPLOADS}/`,
    name: '$id - Template 1 - $fileName',
  },
  detailedBudget: {
    path: `/$id/${TEMPLATE_UPLOADS}/`,
    name: '$id - Template 2 - $fileName',
  },
  financialForecast: {
    path: `/$id/${TEMPLATE_UPLOADS}/`,
    name: '$id - Template 3 - $fileName',
  },
  lastMileIspOffering: {
    path: `/$id/${TEMPLATE_UPLOADS}/`,
    name: '$id - Template 4 - $fileName',
  },
  popWholesalePricing: {
    path: `/$id/${TEMPLATE_UPLOADS}/`,
    name: '$id - Template 5 - $fileName',
  },
  communityRuralDevelopmentBenefitsTemplate: {
    path: `/$id/${TEMPLATE_UPLOADS}/`,
    name: '$id - Template 6 - $fileName',
  },
  wirelessAddendum: {
    path: `/$id/${TEMPLATE_UPLOADS}/`,
    name: '$id - Template 7 - $fileName',
  },
  supportingConnectivityEvidence: {
    path: `/$id/${TEMPLATE_UPLOADS}/`,
    name: '$id - Template 8 - $fileName',
  },
  geographicNames: {
    path: `/$id/${TEMPLATE_UPLOADS}/`,
    name: '$id - Template 9 - $fileName',
  },
  equipmentDetails: {
    path: `/$id/${TEMPLATE_UPLOADS}/`,
    name: '$id - Template 10 - $fileName',
  },
  // Supporting Documents
  copiesOfRegistration: {
    path: `/$id/${SUPPORTING_DOCUMENTS}/Incorporation documents/`,
    name: '$id - $fileName',
  },
  preparedFinancialStatements: {
    path: `/$id/${SUPPORTING_DOCUMENTS}/Independently prepared financial statements/`,
    name: '$id - $fileName',
  },
  logicalNetworkDiagram: {
    path: `/$id/${SUPPORTING_DOCUMENTS}/Logical network diagram/`,
    name: '$id - $fileName',
  },
  projectSchedule: {
    path: `/$id/${SUPPORTING_DOCUMENTS}/Project schedule (Gantt chart)/`,
    name: '$id - $fileName',
  },
  communityRuralDevelopmentBenefits: {
    path: `/$id/${SUPPORTING_DOCUMENTS}/Supporting documents for benefits/`,
    name: '$id - $fileName',
  },
  otherSupportingMaterials: {
    path: `/$id/${SUPPORTING_DOCUMENTS}/Other supporting documents/`,
    name: '$id - $fileName',
  },
  // Coverage
  geographicCoverageMap: {
    path: `/$id/${COVERAGE}/Coverage map/`,
    name: '$id - $fileName',
  },
  coverageAssessmentStatistics: {
    path: `/$id/${COVERAGE}/Statistics email confirmation/`,
    name: '$id - $fileName',
  },
  currentNetworkInfastructure: {
    path: `/$id/${COVERAGE}/Current network infrastructure/`,
    name: '$id - $fileName',
  },
  upgradedNetworkInfrastructure: {
    path: `/$id/${COVERAGE}/Upgraded network infrastructure/`,
    name: '$id - $fileName',
  },
};

const getArchivePath = (
  fieldName: string,
  ccbcId: string,
  fileName: string
) => {
  const { path, name } = archivePaths[fieldName];

  return {
    path: path.replaceAll('$id', ccbcId),
    name: name.replaceAll('$id', ccbcId).replaceAll('$fileName', fileName),
  };
};

export default getArchivePath;
