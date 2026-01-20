import { RJSFSchema } from '@rjsf/utils';
import sharedAssessmentFields from './sharedAssessmentFields';

const projectManagement: RJSFSchema = {
  title: ' ',
  description: '',
  type: 'object',
  required: [
    'assignedTo',
    'targetDate',
    'nextStep',
    'notesAndConsiderations',
    'completedAssessment',
    'otherFiles',
  ],
  properties: {
    ...sharedAssessmentFields.properties,
    notesAndConsiderations: {
      title: 'Notes & Considerations',
      type: 'string',
    },
    completedAssessment: {
      title: 'Completed assessment',
      type: 'string',
    },
  },
};

export default projectManagement;
