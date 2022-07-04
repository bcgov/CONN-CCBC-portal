const mapping = {
  mapping: {
    title: 'Mapping',
    type: 'object',
    description:
      'Please submit the following mapping data in a geo-coded format. KMZ is preferred.',
    properties: {
      geographicCoverageMap: {
        title:
          'Use ISED’s Eligibility Mapping Tool to generate the project coverage that is to be included in your application.',
        type: 'string',
      },
      currentNetworkInfastructure: {
        title:
          'Please include layers for your organization’s (1) fibre lines, (2) PoPs, COs, towers and microwave links, (3) current coverage for the proposed project (with speeds), (4) location of project specific backhaul/backbone access points and (5) PTP microwave paths (if applicable).',
        type: 'string',
      },
      upgradedNetworkInfrastructure: {
        title:
          'Please include layers for your organization’s (1) proposed coverage for the communities proposed in the project, (2) locations (colour differentiated) of new and upgraded towers, PoPs, fibre, PTP microwave links, COs and (3) new PTP microwave paths (colour differentiated) between towers (required for fixed wireless projects.',
        type: 'string',
      },
    },
  },
};

export default mapping;
