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
      enum: ['Needs 2nd review', 'Needs RFI', 'Assessment complete'],
    },
    otherFiles: {
      title: 'Other files',
      type: 'string',
    },
  },
};

export default sharedAssessmentFields;
