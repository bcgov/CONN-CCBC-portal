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
    eligibilityAndImpactsCalculatorRfi: {
      'ui:options': {
        label: false,
      },
    },
    detailedBudgetRfi: {
      'ui:options': {
        label: false,
      },
    },
    financialForecastRfi: {
      'ui:options': {
        label: false,
      },
    },
    lastMileIspOfferingRfi: {
      'ui:options': {
        label: false,
      },
    },
    popWholesalePricingRfi: {
      'ui:options': {
        label: false,
      },
    },
    communityRuralDevelopmentBenefitsTemplateRfi: {
      'ui:options': {
        label: false,
      },
    },
    wirelessAddendumRfi: {
      'ui:options': {
        label: false,
      },
    },
    supportingConnectivityEvidenceRfi: {
      'ui:options': {
        label: false,
      },
    },
    geographicNamesRfi: {
      'ui:options': {
        label: false,
      },
    },
    equipmentDetailsRfi: {
      'ui:options': {
        label: false,
      },
    },
    copiesOfRegistrationRfi: {
      'ui:options': {
        label: false,
      },
    },
    preparedFinancialStatementsRfi: {
      'ui:options': {
        label: false,
      },
    },
    logicalNetworkDiagramRfi: {
      'ui:options': {
        label: false,
      },
    },
    projectScheduleRfi: {
      'ui:options': {
        label: false,
      },
    },
    communityRuralDevelopmentBenefitsRfi: {
      'ui:options': {
        label: false,
      },
    },
    otherSupportingMaterialsRfi: {
      'ui:options': {
        label: false,
      },
    },
    geographicCoverageMapRfi: {
      'ui:options': {
        label: false,
      },
    },
    coverageAssessmentStatisticsRfi: {
      'ui:options': {
        label: false,
      },
    },
    currentNetworkInfastructureRfi: {
      'ui:options': {
        label: false,
      },
    },
    upgradedNetworkInfrastructureRfi: {
      'ui:options': {
        label: false,
      },
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
    'ui:options': {
      label: false,
    },
    eligibilityAndImpactsCalculator: {
      'ui:widget': 'ListFilesWidget',
      'ui:options': {
        label: false,
      },
    },
    detailedBudget: {
      'ui:widget': 'ListFilesWidget',
      'ui:options': {
        label: false,
      },
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

export default rfiUiSchema;
