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

// Separate uiSchema for RFI component incase we need to make changes
export const rfiViewUiSchema = {
  ...rfiUiSchema,
  rfiAdditionalFiles: {
    ...rfiUiSchema.rfiAdditionalFiles,
    'ui:options': {
      label: false,
    },
  },
};

export default rfiUiSchema;
