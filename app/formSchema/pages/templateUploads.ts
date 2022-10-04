import { JSONSchema7 } from 'json-schema';

const templateUploads: Record<string, JSONSchema7> = {
  templateUploads: {
    title: 'Template uploads',
    type: 'object',
    description:
      'Please upload all templates. Do not include special characters in the file name. Files must be less than 100MB.',
    required: [
      'eligibilityAndImpactsCalculator',
      'detailedBudget',
      'financialForecast',
      'lastMileIspOffering',
      'communityRuralDevelopmentBenefitsTemplate',
      'geographicNames',
      'equipmentDetails',
    ],
    properties: {
      eligibilityAndImpactsCalculator: {
        title: 'Template 1 - Eligibility and Impacts Calculator',
        type: 'string',
      },
      detailedBudget: {
        title: 'Template 2 - Detailed Budget',
        type: 'string',
      },
      financialForecast: {
        title: 'Template 3 - Financial Forecast',
        type: 'string',
      },
      lastMileIspOffering: {
        title: 'Template 4 - Last Mile Internet Service Offering',
        type: 'string',
      },
      popWholesalePricing: {
        title:
          'Template 5 - List of Points of Presence and Wholesale Pricing (if applicable)',
        type: 'string',
      },
      communityRuralDevelopmentBenefitsTemplate: {
        title: 'Template 6 - Community and Rural Development Benefits',
        type: 'string',
      },
      wirelessAddendum: {
        title: 'Template 7 - Wireless Addendum (if applicable)',
        type: 'string',
      },
      supportingConnectivityEvidence: {
        title: 'Template 8 - Supporting Connectivity Evidence (if applicable)',
        type: 'string',
      },
      geographicNames: {
        title: 'Template 9 - Backbone and Geographic Names',
        type: 'string',
      },
      equipmentDetails: {
        title: 'Template 10 - Equipment Details',
        type: 'string',
      },
    },
  },
};

export default templateUploads;
