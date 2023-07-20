import { JSONSchema7 } from 'json-schema';
import sharedAssessmentFields from './sharedAssessmentFields';

const technical: JSONSchema7 = {
  title: ' ',
  description: '',
  type: 'object',
  required: [
    'assignedTo',
    'targetDate',
    'nextStep',
    'decision',
    'completedAssessment',
    'otherFiles',
  ],
  properties: {
    ...sharedAssessmentFields.properties,
    decision: {
      title: 'Decision',
      type: 'string',
      anyOf: [
        {
          title: 'No Decision',
          enum: ['No decision'],
        },
        {
          title: 'Pass',
          enum: ['Pass'],
        },
        {
          title: 'Fail',
          enum: ['Fail'],
        },
      ],
      default: 'No decision',
    },
    completedAssessment: {
      title: 'Completed assessment',
      type: 'string',
    },
  },
};

export default technical;
