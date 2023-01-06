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
      enum: [
        'Low risk',
        'Low-medium risk',
        'Medium risk',
        'Medium-high risk',
        'High risk',
      ],
    },
    completedAssessment: {
      title: 'Completed assessment',
      type: 'string',
    },
  },
};

export default financialRisk;
