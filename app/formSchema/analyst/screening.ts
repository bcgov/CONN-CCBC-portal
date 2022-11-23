import { JSONSchema7 } from 'json-schema';

const screening: JSONSchema7 = {
  title: 'Screening',
  description: '',
  type: 'object',
  required: [
    'assignedTo',
    'targetDate',
    'nextStep',
    'decision',
    'contestingMap',
    'assessmentTemplate',
    'otherFiles',
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
      title: 'Next step',
      type: 'string',
      enum: ['Needs 2nd review', 'Needs RFI', 'Assessment complete'],
    },
    decision: {
      title: 'Decision',
      type: 'string',
      enum: ['Eligible', 'Ineligible', 'Incomplete'],
    },
    contestingMap: {
      type: 'boolean',
      title: 'Applicant is contesting the map',
      description: '',
      enum: [false, true],
      default: false,
    },
    assessmentTemplate: {
      title: 'Assessment template',
      type: 'string',
    },
    otherFiles: {
      title: 'Other files',
      type: 'string',
    },
  },
};

export default screening;
