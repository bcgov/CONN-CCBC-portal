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
        anyOf: [
          {
            title:
              'Major permit approval issues anticipated. Likely to influence timeline.',
            enum: [
              'Major permit approval issues anticipated. Likely to influence timeline.',
            ],
          },
          {
            title:
              'Minor permit approval issues anticipated. Could influence timeline.',
            enum: [
              'Minor permit approval issues anticipated. Could influence timeline.',
            ],
          },
          {
            title: 'Normal permitting requirements and timelines anticipated.',
            enum: ['Normal permitting requirements and timelines anticipated.'],
          },
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
