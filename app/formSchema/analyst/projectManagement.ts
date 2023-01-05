import { JSONSchema7 } from 'json-schema';
import sharedAssessmentFields from './sharedAssessmentFields';

const projectManagement: JSONSchema7 = {
  title: ' ',
  description: '',
  type: 'object',
  required: [
    'assignedTo',
    'targetDate',
    'nextStep',
    'completedAssessment',
    'otherFiles',
  ],
  properties: {
    ...sharedAssessmentFields.properties,
    completedAssessment: {
      title: 'Completed assessment',
      type: 'string',
    },
  },
};

export default projectManagement;
