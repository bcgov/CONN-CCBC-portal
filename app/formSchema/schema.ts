const schema = {
  type: 'object',
  properties: {
    organizationProfile: {
      title: 'Organization Profile',
      type: 'object',
      properties: {
        organizationName: {
          title: 'Organization name (legal name)',
          type: 'string',
        },
      },
    },
  },
};

export default schema;
