const mapping = {
  mapping: {
    title: 'Mapping',
    type: 'object',
    description:
      'Please submit the following mapping data in a geo-coded format. KMZ is preferred.',
    properties: {
      geographicCoverageMap: {
        title:
          'Use ISED’s Eligibility Mapping Tool to generate the Project Coverage that is to be included in your application.',
        type: 'string',
      },
      coverageAssessmentStatistics: {
        title:
          'Please upload the email you received upon completion of the Project Coverage.',
        type: 'string',
      },
      currentNetworkInfastructure: {
        title:
          'Please include layers for your organization’s (1) fibre lines, (2) Point-of-Presence (PoPs), COs, towers and microwave links, (3) current Coverage for the proposed Project (with speeds), (4) location of Project specific Backhaul/Backbone Access Points and (5) PTP microwave paths (if applicable).',
        type: 'string',
      },
      upgradedNetworkInfrastructure: {
        title:
          'Please include layers for your organization’s (1) proposed Coverage for the communities proposed in the Project, (2) locations (colour differentiated) of new and upgraded towers, Point-of-Presence (PoPs), fibre, PTP microwave links, COs and (3) new PTP microwave paths (colour differentiated) between towers (required for fixed wireless Projects.',
        type: 'string',
      },
    },
  },
};

export default mapping;
