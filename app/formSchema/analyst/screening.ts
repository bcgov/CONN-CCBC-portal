import { JSONSchema7 } from 'json-schema';

const screening: JSONSchema7 = {
  title: ' ',
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
      title: 'Progress',
      type: 'string',
      enum: ['Needs 2nd review', 'Needs RFI', 'Assessment complete'],
    },
    decision: {
      title: 'Decision',
      type: 'string',
      enum: ['Eligible', 'Ineligible', 'Incomplete'],
    },
    contestingMap: {
      title: 'Contesting Map',
      type: 'array',
      items: {
        type: 'string',
        enum: ['Applicant is contesting the area map'],
      },
      uniqueItems: true,
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
