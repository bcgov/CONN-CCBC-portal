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
          title: 'No Decision',
          enum: ['No decision'],
        },
        {
          title: 'Low Risk',
          enum: ['Low risk'],
        },
        {
          title: 'Low-Medium Risk',
          enum: ['Low-medium risk'],
        },
        {
          title: 'Medium Risk',
          enum: ['Medium risk'],
        },
        {
          title: 'Medium-High Risk',
          enum: ['Medium-high risk'],
        },
        {
          title: 'High Risk',
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
