import { JSONSchema7 } from 'json-schema';

const screening: Record<string, JSONSchema7> = {
  screening: {
    title: 'Screening',
    description: '',
    type: 'object',
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
        title: 'Contesting map',
        enum: ['Applicant is contesting the map'],
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
  },
};

export default screening;
