import { JSONSchema7 } from 'json-schema';

const permitting: JSONSchema7 = {
  title: ' ',
  description: '',
  type: 'object',
  required: [
    'assignedTo',
    'targetDate',
    'decision',
    'notesAndConsiderations',
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
    decision: {
      title: 'Decision',
      type: 'array',
      items: {
        type: 'string',
        enum: [
          'Major permit approval issues anticipated',
          'Permits will likely delay project timeline',
          'No obvious flags identified at this stage',
        ],
      },
      uniqueItems: true,
    },
    notesAndConsiderations: {
      title: 'Notes & Considerations',
      type: 'string',
    },
    otherFiles: {
      title: 'Other files',
      type: 'string',
    },
  },
};

export default permitting;
