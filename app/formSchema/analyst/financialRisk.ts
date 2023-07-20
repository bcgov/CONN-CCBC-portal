import { JSONSchema7 } from 'json-schema';
import sharedAssessmentFields from './sharedAssessmentFields';

const financialRisk: JSONSchema7 = {
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
          title: 'No decision',
          enum: ['No decision'],
        },
        {
          title: 'Low risk',
          enum: ['Low risk'],
        },
        {
          title: 'Low-medium risk',
          enum: ['Low-medium risk'],
        },
        {
          title: 'Medium risk',
          enum: ['Medium risk'],
        },
        {
          title: 'Medium-high risk',
          enum: ['Medium-high risk'],
        },
        {
          title: 'High risk',
          enum: ['High risk'],
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

export default financialRisk;
