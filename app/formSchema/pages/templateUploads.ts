const templateUploads = {
  templateUploads: {
    title: 'Template uploads',
    type: 'object',
    description:
      'Please upload all templates. Do not include special characters in the file name. Files must be less than 100MB.',
    properties: {
      eligibilityAndImpactsCalculator: {
        type: 'string',
      },
      detailedBudget: {
        type: 'string',
      },
      financialForecast: {
        type: 'string',
      },
      lastMileIspOffering: {
        type: 'string',
      },
      popWholesalePricing: {
        type: 'string',
      },
      communityRuralDevelopmentBenefitsTemplate: {
        type: 'string',
      },
      wirelessAddendum: {
        type: 'string',
      },
      supportingConnectivityEvidence: {
        type: 'string',
      },
      geographicNames: {
        type: 'string',
      },
      equipmentDetails: {
        type: 'string',
      },
    },
  },
};

export default templateUploads;
