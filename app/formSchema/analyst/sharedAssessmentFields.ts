import { JSONSchema7 } from 'json-schema';

const sharedAssessmentFields: JSONSchema7 = {
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
          title: 'Needs 2nd review',
          enum: ['Needs 2nd review'],
        },
        {
          title: 'Needs RFI',
          enum: ['Needs RFI'],
        },
        {
          title: 'Assessment complete',
          enum: ['Assessment complete'],
        },
      ],
      default: 'Not started',
    },
    otherFiles: {
      title: 'Other files',
      type: 'string',
    },
  },
};

export default sharedAssessmentFields;
