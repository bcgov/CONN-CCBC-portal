import { JSONSchema7 } from 'json-schema';

const gis: JSONSchema7 = {
  title: ' ',
  description: '',
  type: 'object',
  required: [
    'assignedTo',
    'targetDate',
    'nextStep',
    'commentsOnCoverageData',
    'commentsOnHouseholdCounts',
    'commentsOnOverbuild',
    'commentsOnOverlap',
  ],
  properties: {
    assignedTo: {
      title: 'Assigned to',
      type: 'string',
    },
    targetDate: {
      title: 'Target date',
      type: 'string',
    },
    nextStep: {
      title: 'Progress',
      type: 'string',
      anyOf: [
        {
          title: 'Not started',
          enum: ['Not started'],
        },
        {
          title: 'Needs RFI',
          enum: ['Needs RFI'],
        },
        {
          title: 'Needs 2nd review',
          enum: ['Needs 2nd review'],
        },
        {
          title: 'Assessment complete',
          enum: ['Assessment complete'],
        },
      ],
      default: 'Not started',
    },
    commentsOnCoverageData: {
      title: 'Comments on coverage data',
      type: 'string',
    },
    commentsOnHouseholdCounts: {
      title: 'Comments on household counts',
      type: 'string',
    },
    commentsOnOverbuild: {
      title: 'Comments on overbuild',
      type: 'string',
    },
    commentsOnOverlap: {
      title: 'Comments on overlap',
      type: 'string',
    },
  },
};

export default gis;
