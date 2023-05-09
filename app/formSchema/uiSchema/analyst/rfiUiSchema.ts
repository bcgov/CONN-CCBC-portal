import { EXCEL_FILE_EXTENSIONS } from '../constants';

const rfiUiSchema = {
  'ui:order': [
    'rfiType',
    'rfiDueBy',
    'rfiEmailCorrespondance',
    'rfiAdditionalFiles',
    'eligibilityAndImpactsCalculatorRfi',
    'detailedBudgetRfi',
    'eligibilityAndImpactsCalculator',
    'detailedBudget',
    'financialForecastRfi',
    'lastMileIspOfferingRfi',
    'popWholesalePricingRfi',
    'communityRuralDevelopmentBenefitsTemplateRfi',
    'wirelessAddendumRfi',
    'supportingConnectivityEvidenceRfi',
    'geographicNamesRfi',
    'equipmentDetailsRfi',
    'eligibilityAndImpactsCalculator',
    'detailedBudget',
    'financialForecast',
    'lastMileIspOffering',
    'popWholesalePricing',
    'communityRuralDevelopmentBenefitsTemplate',
    'wirelessAddendum',
    'supportingConnectivityEvidence',
    'geographicNames',
    'equipmentDetails',
  ],
  'ui:title': '',
  rfiType: {
    'ui:widget': 'CheckboxesWidget',
    'ui:options': {
      boldTitle: true,
    },
  },
  rfiDueBy: {
    'ui:widget': 'DatePickerWidget',
    'ui:options': {
      boldTitle: true,
    },
  },
  rfiEmailCorrespondance: {
    'ui:widget': 'FileWidget',
    'ui:options': {
      allowMultipleFiles: true,
      label: false,
    },
  },
  rfiAdditionalFiles: {
    'ui:title': 'Request replacement or additional files',
    'ui:options': {
      boldTitle: true,
      checkboxColumns: 2,
      columns: 2,
    },
    eligibilityAndImpactsCalculator: {
      'ui:widget': 'hidden',
      'ui:options': {
        label: false,
      },
    },
    detailedBudget: {
      'ui:widget': 'hidden',
      'ui:options': {
        label: false,
      },
    },
    financialForecast: {
      'ui:widget': 'hidden',
      'ui:options': {
        label: false,
      },
    },
    lastMileIspOffering: {
      'ui:widget': 'hidden',
      'ui:options': {
        label: false,
      },
    },
    popWholesalePricing: {
      'ui:widget': 'hidden',
      'ui:options': {
        label: false,
      },
    },
    communityRuralDevelopmentBenefitsTemplate: {
      'ui:widget': 'hidden',
      'ui:options': {
        label: false,
      },
    },
    wirelessAddendum: {
      'ui:widget': 'hidden',
      'ui:options': {
        label: false,
      },
    },
    supportingConnectivityEvidence: {
      'ui:widget': 'hidden',
      'ui:options': {
        label: false,
      },
    },
    geographicNames: {
      'ui:widget': 'hidden',
      'ui:options': {
        label: false,
      },
    },
    equipmentDetails: {
      'ui:widget': 'hidden',
      'ui:options': {
        label: false,
      },
    },
    copiesOfRegistration: {
      'ui:widget': 'hidden',
      'ui:options': {
        label: false,
      },
    },
    preparedFinancialStatements: {
      'ui:widget': 'hidden',
      'ui:options': {
        label: false,
      },
    },
    logicalNetworkDiagram: {
      'ui:widget': 'hidden',
      'ui:options': {
        label: false,
      },
    },
    projectSchedule: {
      'ui:widget': 'hidden',
      'ui:options': {
        label: false,
      },
    },
    communityRuralDevelopmentBenefits: {
      'ui:widget': 'hidden',
      'ui:options': {
        label: false,
      },
    },
    otherSupportingMaterials: {
      'ui:widget': 'hidden',
      'ui:options': {
        label: false,
      },
    },
    geographicCoverageMap: {
      'ui:widget': 'hidden',
      'ui:options': {
        label: false,
      },
    },
    coverageAssessmentStatistics: {
      'ui:widget': 'hidden',
      'ui:options': {
        label: false,
      },
    },
    currentNetworkInfastructure: {
      'ui:widget': 'hidden',
      'ui:options': {
        label: false,
      },
    },
    upgradedNetworkInfrastructure: {
      'ui:widget': 'hidden',
      'ui:options': {
        label: false,
      },
    },
  },
};

// Separate uiSchema for RFI list component
export const rfiViewUiSchema = {
  ...rfiUiSchema,
  rfiAdditionalFiles: {
    ...rfiUiSchema.rfiAdditionalFiles,
    'ui:field': 'RequestedFilesField',
    eligibilityAndImpactsCalculator: {
      'ui:widget': 'ListFilesWidget',
    },
    detailedBudget: {
      'ui:widget': 'ListFilesWidget',
    },
    financialForecast: {
      'ui:widget': 'ListFilesWidget',
    },
    lastMileIspOffering: {
      'ui:widget': 'ListFilesWidget',
    },
    popWholesalePricing: {
      'ui:widget': 'ListFilesWidget',
    },
    communityRuralDevelopmentBenefitsTemplate: {
      'ui:widget': 'ListFilesWidget',
    },
    wirelessAddendum: {
      'ui:widget': 'ListFilesWidget',
    },
    supportingConnectivityEvidence: {
      'ui:widget': 'ListFilesWidget',
    },
    geographicNames: {
      'ui:widget': 'ListFilesWidget',
    },
    equipmentDetails: {
      'ui:widget': 'ListFilesWidget',
    },
    copiesOfRegistration: {
      'ui:widget': 'ListFilesWidget',
    },
    preparedFinancialStatements: {
      'ui:widget': 'ListFilesWidget',
    },
    logicalNetworkDiagram: {
      'ui:widget': 'ListFilesWidget',
    },
    projectSchedule: {
      'ui:widget': 'ListFilesWidget',
    },
    communityRuralDevelopmentBenefits: {
      'ui:widget': 'ListFilesWidget',
    },
    otherSupportingMaterials: {
      'ui:widget': 'ListFilesWidget',
    },
    geographicCoverageMap: {
      'ui:widget': 'ListFilesWidget',
    },
    coverageAssessmentStatistics: {
      'ui:widget': 'ListFilesWidget',
    },
    currentNetworkInfastructure: {
      'ui:widget': 'ListFilesWidget',
    },
    upgradedNetworkInfrastructure: {
      'ui:widget': 'ListFilesWidget',
    },
  },
};

export const rfiApplicantUiSchema = {
  'ui:order': [
    'rfiType',
    'rfiDueBy',
    'rfiEmailCorrespondance',
    'rfiAdditionalFiles',
    'eligibilityAndImpactsCalculatorRfi',
    'detailedBudgetRfi',
    'eligibilityAndImpactsCalculator',
    'detailedBudget',
    'financialForecastRfi',
    'lastMileIspOfferingRfi',
    'popWholesalePricingRfi',
    'communityRuralDevelopmentBenefitsTemplateRfi',
    'wirelessAddendumRfi',
    'supportingConnectivityEvidenceRfi',
    'geographicNamesRfi',
    'equipmentDetailsRfi',
    'eligibilityAndImpactsCalculator',
    'detailedBudget',
    'financialForecast',
    'lastMileIspOffering',
    'popWholesalePricing',
    'communityRuralDevelopmentBenefitsTemplate',
    'wirelessAddendum',
    'supportingConnectivityEvidence',
    'geographicNames',
    'equipmentDetails',
  ],
  rfiType: {
    'ui:widget': 'hidden',
    'ui:title': ' ',
    'ui:options': {
      label: false,
      title: false,
    },
  },
  rfiDueBy: {
    'ui:widget': 'hidden',
    'ui:options': {
      label: false,
    },
  },
  rfiEmailCorrespondance: {
    'ui:widget': 'hidden',
    'ui:options': {
      label: false,
    },
  },
  rfiAdditionalFiles: {
    'ui:options': {
      label: false,
    },
    eligibilityAndImpactsCalculator: {
      'ui:widget': 'FileWidget',
      'ui:options': {
        hideOptional: true,
      },
    },
    eligibilityAndImpactsCalculatorRfi: {
      'ui:widget': 'hidden',
      'ui:options': {
        label: false,
      },
    },
    detailedBudget: {
      'ui:widget': 'FileWidget',
      'ui:options': {
        hideOptional: true,
      },
    },
    detailedBudgetRfi: {
      'ui:widget': 'hidden',
      'ui:options': {
        label: false,
      },
    },
    financialForecast: {
      'ui:widget': 'FileWidget',
      'ui:options': {
        hideOptional: true,
      },
    },
    financialForecastRfi: {
      'ui:widget': 'hidden',
      'ui:options': {
        label: false,
      },
    },
    lastMileIspOffering: {
      'ui:widget': 'FileWidget',
      'ui:options': {
        hideOptional: true,
      },
    },
    lastMileIspOfferingRfi: {
      'ui:widget': 'hidden',
      'ui:options': {
        label: false,
      },
    },
    popWholesalePricing: {
      'ui:widget': 'FileWidget',
      'ui:options': {
        hideOptional: true,
      },
    },
    popWholesalePricingRfi: {
      'ui:widget': 'hidden',
      'ui:options': {
        label: false,
      },
    },
    communityRuralDevelopmentBenefitsTemplate: {
      'ui:widget': 'FileWidget',
      'ui:options': {
        hideOptional: true,
      },
    },
    communityRuralDevelopmentBenefitsTemplateRfi: {
      'ui:widget': 'hidden',
      'ui:options': {
        label: false,
      },
    },
    wirelessAddendum: {
      'ui:widget': 'FileWidget',
      'ui:options': {
        hideOptional: true,
      },
    },
    wirelessAddendumRfi: {
      'ui:widget': 'hidden',
      'ui:options': {
        label: false,
      },
    },
    supportingConnectivityEvidence: {
      'ui:widget': 'FileWidget',
      'ui:options': {
        hideOptional: true,
      },
    },
    supportingConnectivityEvidenceRfi: {
      'ui:widget': 'hidden',
      'ui:options': {
        label: false,
      },
    },
    geographicNames: {
      'ui:widget': 'FileWidget',
      'ui:options': {
        hideOptional: true,
      },
    },
    geographicNamesRfi: {
      'ui:widget': 'hidden',
      'ui:options': {
        label: false,
      },
    },
    equipmentDetails: {
      'ui:widget': 'FileWidget',
      'ui:options': {
        hideOptional: true,
      },
    },
    equipmentDetailsRfi: {
      'ui:widget': 'hidden',
      'ui:options': {
        label: false,
      },
    },
    copiesOfRegistration: {
      'ui:widget': 'FileWidget',
      'ui:options': {
        hideOptional: true,
        allowMultipleFiles: true,
      },
    },
    copiesOfRegistrationRfi: {
      'ui:widget': 'hidden',
      'ui:options': {
        label: false,
      },
    },
    preparedFinancialStatements: {
      'ui:widget': 'FileWidget',
      'ui:options': {
        hideOptional: true,
        allowMultipleFiles: true,
      },
    },
    preparedFinancialStatementsRfi: {
      'ui:widget': 'hidden',
      'ui:options': {
        label: false,
      },
    },
    logicalNetworkDiagram: {
      'ui:widget': 'FileWidget',
      'ui:options': {
        hideOptional: true,
        allowMultipleFiles: true,
        fileTypes:
          '.pdf, .png, .jpg, .jpeg, .vsd, .vsdx, .doc, .docx, .ppt, .pptx',
      },
    },
    logicalNetworkDiagramRfi: {
      'ui:widget': 'hidden',
      'ui:options': {
        label: false,
      },
    },
    projectSchedule: {
      'ui:widget': 'FileWidget',
      'ui:options': {
        hideOptional: true,
        allowMultipleFiles: true,
        fileTypes: `${EXCEL_FILE_EXTENSIONS}, .mpp`,
      },
    },
    projectScheduleRfi: {
      'ui:widget': 'hidden',
      'ui:options': {
        label: false,
      },
    },
    communityRuralDevelopmentBenefits: {
      'ui:widget': 'FileWidget',
      'ui:options': {
        hideOptional: true,
        allowMultipleFiles: true,
      },
    },
    communityRuralDevelopmentBenefitsRfi: {
      'ui:widget': 'hidden',
      'ui:options': {
        label: false,
      },
    },
    otherSupportingMaterials: {
      'ui:widget': 'FileWidget',
      'ui:options': {
        hideOptional: true,
        allowMultipleFiles: true,
      },
    },
    otherSupportingMaterialsRfi: {
      'ui:widget': 'hidden',
      'ui:options': {
        label: false,
      },
    },
    geographicCoverageMap: {
      'ui:widget': 'FileWidget',
      'ui:options': {
        hideOptional: true,
        fileTypes: '.kmz',
      },
    },
    geographicCoverageMapRfi: {
      'ui:widget': 'hidden',
      'ui:options': {
        label: false,
      },
    },
    coverageAssessmentStatistics: {
      'ui:widget': 'FileWidget',
      'ui:options': {
        hideOptional: true,
      },
    },
    coverageAssessmentStatisticsRfi: {
      'ui:widget': 'hidden',
      'ui:options': {
        label: false,
      },
    },
    currentNetworkInfastructure: {
      'ui:widget': 'FileWidget',
      'ui:options': {
        hideOptional: true,
        allowMultipleFiles: true,
        fileTypes: '.kml, .kmz',
      },
    },
    currentNetworkInfastructureRfi: {
      'ui:widget': 'hidden',
      'ui:options': {
        label: false,
      },
    },
    upgradedNetworkInfrastructure: {
      'ui:widget': 'FileWidget',
      'ui:options': {
        hideOptional: true,
        allowMultipleFiles: true,
        fileTypes: '.kml, .kmz',
      },
    },
    upgradedNetworkInfrastructureRfi: {
      'ui:widget': 'hidden',
      'ui:options': {
        label: false,
      },
    },
  },
};

export default rfiUiSchema;
