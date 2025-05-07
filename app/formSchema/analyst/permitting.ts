import { RJSFSchema } from '@rjsf/utils';
import sharedAssessmentFields from './sharedAssessmentFields';

const permitting: RJSFSchema = {
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
          'Major permit approval issues anticipated. Likely to influence timeline.',
          'Minor permit approval issues anticipated. Could influence timeline.',
          'Normal permitting requirements and timelines anticipated.',
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
