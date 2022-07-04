const existingNetworkCoverage = {
  existingNetworkCoverage: {
    title: 'Existing network coverage',
    description:
      'This information is used by ISED to continually update broadband coverage data. ',
    type: 'object',
    required: [
      'hasProvidedExitingNetworkCoverage',
      'hasPassiveInfrastructure',
      'isInfrastuctureAvailable',
      'requiresThirdPartyInfrastructureAccess',
    ],
    properties: {
      hasProvidedExitingNetworkCoverage: {
        title: `Please indicate if you have already provided your existing network and/or coverage information to ISED or the Canadian Radio-television and Telecommunications Commission (CRTC) in the past 12 months, or if you will submit such information to ISED before the close of applications. For more information on how to submit existing network and coverage information, refer to the Universal Broadband Fund (UBF) website.`,
        type: 'string',
        enum: [
          'I have provided existing network information and/or coverage to ISED or the CRTC in the past 12 months',
          'I will provide existing network information and/or coverage to ISED by the application deadline',
          'I do not currently have existing coverage',
        ],
      },
      hasPassiveInfrastructure: {
        title:
          'Does the applicant own passive infrastructure (including, for example, towers, poles, rights of way or other similar assets and infrastructure)?',
        type: 'boolean',
        enum: [true, false],
        enumNames: ['Yes', 'No'],
      },
      isInfrastuctureAvailable: {
        title: `The applicant intends to make reasonable efforts to make its passive infrastructure available for use by other broadband operators to expand and improve coverage in Canada?`,
        type: 'boolean',
        enum: [true, false],
        enumNames: ['Yes', 'No'],
      },
      requiresThirdPartyInfrastructureAccess: {
        title: `Does the applicant’s project require access to third party passive infrastructure (including for example, towers, poles, rights of way or other similar assets and infrastructure)?`,
        type: 'boolean',
        enum: [true, false],
        enumNames: ['Yes', 'No'],
      },
    },
  },
};

export default existingNetworkCoverage;
