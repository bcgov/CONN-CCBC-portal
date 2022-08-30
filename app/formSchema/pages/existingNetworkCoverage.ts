import { JSONSchema7 } from 'json-schema';

const existingNetworkCoverage = {
  existingNetworkCoverage: {
    title: 'Existing network coverage',
    description:
      'This information is used by ISED to continually update broadband Coverage data. ',
    type: 'object',
    required: [
      'hasProvidedExitingNetworkCoverage',
      'hasPassiveInfrastructure',
      'isInfrastuctureAvailable',
      'requiresThirdPartyInfrastructureAccess',
    ],
    properties: {
      hasProvidedExitingNetworkCoverage: {
        title: `Please indicate if you have already provided your existing Network and/or Coverage information to ISED or the Canadian Radio-television and Telecommunications Commission (CRTC) in the past 12 months, or if you will submit such information to ISED before the close of applications. For more information on how to submit existing Network and Coverage information, refer to the Universal Broadband Fund (UBF) website.`,
        type: 'string',
        enum: [
          'I have provided existing Network information and/or Coverage to ISED or the CRTC in the past 12 months',
          'I will provide existing Network information and/or Coverage to ISED by the application deadline',
          'I do not currently have existing Coverage',
        ],
      },
      hasPassiveInfrastructure: {
        title:
          'Does the Applicant own Passive Infrastructure (including, for example, towers, poles, rights of way or other similar assets and infrastructure)?',
        type: 'boolean',
        enum: [true, false],
        enumNames: ['Yes', 'No'],
      },
      isInfrastuctureAvailable: {
        title: `Does the Applicant intend to make reasonable efforts to make its Passive Infrastructure available for use by other broadband operators to expand and improve Coverage in Canada?`,
        type: 'boolean',
        enum: [true, false],
        enumNames: ['Yes', 'No'],
      },
      requiresThirdPartyInfrastructureAccess: {
        title: `Does the Applicant’s Project require access to Third Party Passive Infrastructure (i.e., towers, poles, rights of way or other similar assets and infrastructure)?`,
        type: 'boolean',
        enum: [true, false],
        enumNames: ['Yes', 'No'],
      },
    },
  },
} as Record<string, JSONSchema7>;

export default existingNetworkCoverage;
