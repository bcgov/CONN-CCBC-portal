import { JSONSchema7 } from 'json-schema';
import sharedAssessmentFields from './sharedAssessmentFields';

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
    'nextStep',
  ],
  properties: {
    ...sharedAssessmentFields.properties,
    decision: {
      title: 'Flags',
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
  },
};

export default permitting;
