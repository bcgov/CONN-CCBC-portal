import { RJSFSchema } from '@rjsf/utils';
import sharedAssessmentFields from './sharedAssessmentFields';

const noDecision = 'No decision';
const lowRisk = 'Low risk';
const lowMediumRisk = 'Low-medium risk';
const mediumRisk = 'Medium risk';
const mediumHighRisk = 'Medium-high risk';
const highRisk = 'High risk';

const financialRisk: RJSFSchema = {
  title: ' ',
  description: '',
  type: 'object',
  required: [
    'assignedTo',
    'targetDate',
    'nextStep',
    'decision',
    'notesAndConsiderations',
    'completedAssessment',
    'otherFiles',
  ],
  properties: {
    ...sharedAssessmentFields.properties,
    decision: {
      title: 'Decision',
      type: 'string',
      enum: [
        noDecision,
        lowRisk,
        lowMediumRisk,
        mediumRisk,
        mediumHighRisk,
        highRisk,
      ],
      default: noDecision,
    },
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

export default financialRisk;
