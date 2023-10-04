import { EXCEL_FILE_EXTENSIONS } from '../constants';

const templateUploads = {
  'ui:order': [
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
  eligibilityAndImpactsCalculator: {
    'ui:widget': 'FileWidget',
    'ui:options': {
      label: false,
      fileTypes: EXCEL_FILE_EXTENSIONS,
      templateNumber: 1,
      templateValidate: true,
    },
  },
  detailedBudget: {
    'ui:widget': 'FileWidget',
    'ui:options': {
      label: false,
      fileTypes: EXCEL_FILE_EXTENSIONS,
      templateNumber: 2,
      templateValidate: true,
    },
  },
  financialForecast: {
    'ui:widget': 'FileWidget',
    'ui:options': {
      label: false,
      fileTypes: EXCEL_FILE_EXTENSIONS,
    },
  },

  lastMileIspOffering: {
    'ui:widget': 'FileWidget',
    'ui:options': {
      label: false,
      fileTypes: EXCEL_FILE_EXTENSIONS,
    },
  },
  popWholesalePricing: {
    'ui:widget': 'FileWidget',
    'ui:options': {
      label: false,
      fileTypes: EXCEL_FILE_EXTENSIONS,
    },
  },
  communityRuralDevelopmentBenefitsTemplate: {
    'ui:widget': 'FileWidget',
    'ui:options': {
      label: false,
      fileTypes: EXCEL_FILE_EXTENSIONS,
    },
  },
  wirelessAddendum: {
    'ui:widget': 'FileWidget',
    'ui:options': {
      label: false,
      fileTypes: EXCEL_FILE_EXTENSIONS,
    },
  },
  supportingConnectivityEvidence: {
    'ui:widget': 'FileWidget',
    'ui:options': {
      label: false,
      fileTypes: EXCEL_FILE_EXTENSIONS,
    },
  },
  geographicNames: {
    'ui:widget': 'FileWidget',
    'ui:options': {
      label: false,
      fileTypes: EXCEL_FILE_EXTENSIONS,
    },
  },
  equipmentDetails: {
    'ui:widget': 'FileWidget',
    'ui:options': {
      label: false,
      fileTypes: EXCEL_FILE_EXTENSIONS,
    },
  },
};

export default templateUploads;
