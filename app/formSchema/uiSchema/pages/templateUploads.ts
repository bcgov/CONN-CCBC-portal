import { MAX_LONG_INPUT_LENGTH, EXCEL_FILE_EXTENSIONS } from '../constants';

const templateUploads = {
  uiOrder: [
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
  eligibilityAndImpactsCalculator: {
    'ui:widget': 'FileWidget',
    'ui:description': 'Template 1 - Eligibility and Impacts Calculator',
    'ui:options': {
      maxLength: MAX_LONG_INPUT_LENGTH,
      label: false,
      fileTypes: EXCEL_FILE_EXTENSIONS,
    },
  },
  detailedBudget: {
    'ui:widget': 'FileWidget',
    'ui:description': 'Template 2 - Detailed Budget',
    'ui:options': {
      maxLength: MAX_LONG_INPUT_LENGTH,
      label: false,
      fileTypes: EXCEL_FILE_EXTENSIONS,
    },
  },
  financialForecast: {
    'ui:widget': 'FileWidget',
    'ui:description': 'Template 3 - Financial Forecast',
    'ui:options': {
      maxLength: MAX_LONG_INPUT_LENGTH,
      label: false,
      fileTypes: EXCEL_FILE_EXTENSIONS,
    },
  },

  lastMileIspOffering: {
    'ui:widget': 'FileWidget',
    'ui:description': 'Template 4 - Last Mile Internet Service Offering',
    'ui:options': {
      maxLength: MAX_LONG_INPUT_LENGTH,
      label: false,
      fileTypes: EXCEL_FILE_EXTENSIONS,
    },
  },
  popWholesalePricing: {
    'ui:widget': 'FileWidget',
    'ui:description':
      'Template 5 - List of Points of Presence and Wholesale Pricing (if applicable)',
    'ui:options': {
      maxLength: MAX_LONG_INPUT_LENGTH,
      label: false,
      fileTypes: EXCEL_FILE_EXTENSIONS,
    },
  },
  communityRuralDevelopmentBenefitsTemplate: {
    'ui:widget': 'FileWidget',
    'ui:description': 'Template 6 - Community and Rural Development Benefits',
    'ui:options': {
      maxLength: MAX_LONG_INPUT_LENGTH,
      label: false,
      fileTypes: EXCEL_FILE_EXTENSIONS,
    },
  },
  wirelessAddendum: {
    'ui:widget': 'FileWidget',
    'ui:description': 'Template 7 - Wireless Addendum (if applicable)',
    'ui:options': {
      maxLength: MAX_LONG_INPUT_LENGTH,
      label: false,
      fileTypes: EXCEL_FILE_EXTENSIONS,
    },
  },
  supportingConnectivityEvidence: {
    'ui:widget': 'FileWidget',
    'ui:description':
      'Template 8 - Supporting Connectivity Evidence (if applicable)',
    'ui:options': {
      maxLength: MAX_LONG_INPUT_LENGTH,
      label: false,
      fileTypes: EXCEL_FILE_EXTENSIONS,
    },
  },
  geographicNames: {
    'ui:widget': 'FileWidget',
    'ui:description': 'Template 9 - Geographic Names',
    'ui:options': {
      maxLength: MAX_LONG_INPUT_LENGTH,
      label: false,
      fileTypes: EXCEL_FILE_EXTENSIONS,
    },
  },
  equipmentDetails: {
    'ui:widget': 'FileWidget',
    'ui:description': 'Template 10 - Equipment Details',
    'ui:options': {
      maxLength: MAX_LONG_INPUT_LENGTH,
      label: false,
      fileTypes: EXCEL_FILE_EXTENSIONS,
    },
  },
};

export default templateUploads;
