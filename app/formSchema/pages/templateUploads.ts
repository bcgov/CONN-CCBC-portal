const templateUploads = {
  templateUploads: {
    title: 'Template uploads',
    type: 'object',
    description:
      'Please upload all templates. Please do not include special characters in the file name. The maximum size per file is 100MB.',
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
        title: 'Template 5 - List of Points of Presence and Wholesale Pricing',
        type: 'string',
      },
      communityRuralDevelopmentBenefitsTemplate: {
        title: 'Template 6 - Community and Rural Development Benefits',
        type: 'string',
      },
      wirelessAddendum: {
        title: 'Template 7 - Wireless Addendum ',
        type: 'string',
      },
      supportingConnectivityEvidence: {
        title: 'Template 8 - Supporting Connectivity Evidence',
        type: 'string',
      },
      geographicNames: {
        title: 'Template 9 - Geographic Names',
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
