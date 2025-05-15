import { RJSFSchema } from '@rjsf/utils';

const sharedAssessmentFields: RJSFSchema = {
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
      enum: [
        'Not started',
        'Needs 2nd review',
        'Needs RFI',
        'Assessment complete',
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
