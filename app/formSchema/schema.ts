const schema = {
  type: 'object',
  properties: {
    organizationProfile: {
      title: 'Organization Profile',
      description: 'Provide an overview of you organization',
      type: 'object',
      properties: {
        organizationName: {
          title: 'Organization name (legal name)',
          type: 'string',
        },
        isLegalPrimaryName: {
          title: 'Is this the primary legal name?',
          type: 'boolean',
          enum: [true, false],
          enumNames: ['Yes', 'No'],
        },
      },
    },
  },
};

export default schema;
