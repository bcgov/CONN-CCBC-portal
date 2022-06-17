const benefits = {
  benefits: {
    title: 'Benefits',
    type: 'object',
    description:
      'For successful applicants receiving funding under CCBC, the contribution amounts will be made public via government websites, media releases or other similar materials. Information provided may be used, in whole or in part to assist the Province of BC and ISED in the preparation of any public announcements.',
    required: [
      'projectTitle',
      'geographicAreaDescription',
      'projectDescription',
    ],
    properties: {
      projectTitle: {
        type: 'string',
      },
      geographicAreaDescription: {
        type: 'string',
      },

      projectDescription: {
        type: 'string',
      },
    },
  },
};

export default benefits;
