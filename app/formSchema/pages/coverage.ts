import { JSONSchema7 } from 'json-schema';

const coverage: Record<string, JSONSchema7> = {
  coverage: {
    title: 'Coverage',
    type: 'object',
    description: 'Please submit the following coverage data.',
    required: [
      'geographicCoverageMap',
      'coverageAssessmentStatistics',
      'currentNetworkInfastructure',
      'upgradedNetworkInfrastructure',
    ],
    properties: {
      geographicCoverageMap: {
        title: `Geographic coverage map from ISED's Eligibility Mapping Tool. KMZ is required.`,
        type: 'string',
      },
      coverageAssessmentStatistics: {
        title: `ISED's Eligibility Mapping Tool - Coverage Assessment and Statistics`,
        type: 'string',
      },
      currentNetworkInfastructure: {
        title: 'Current network infrastructure in a geo-coded format',
        type: 'string',
      },
      upgradedNetworkInfrastructure: {
        title:
          'Proposed or Upgraded Network Infrastructure (project-specific) in a geo-coded format',
        type: 'string',
      },
    },
  },
};

export default coverage;
