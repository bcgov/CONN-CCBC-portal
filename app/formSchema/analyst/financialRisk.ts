import { JSONSchema7 } from 'json-schema';
import sharedAssessmentFields from './sharedAssessmentFields';

// when a different label and title is needed
// decouple the title from the enum, this is a SonarCloud workaround
// the enum MUST stay as below for data to be maintained
const noDecision = 'No decision';
const lowRisk = 'Low risk';
const lowMediumRisk = 'Low-medium risk';
const mediumRisk = 'Medium risk';
const mediumHighRisk = 'Medium-high risk';
const highRisk = 'High risk';

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
          title: noDecision,
          enum: [noDecision],
        },
        {
          title: lowRisk,
          enum: [lowRisk],
        },
        {
          title: lowMediumRisk,
          enum: [lowMediumRisk],
        },
        {
          title: mediumRisk,
          enum: [mediumRisk],
        },
        {
          title: mediumHighRisk,
          enum: [mediumHighRisk],
        },
        {
          title: highRisk,
          enum: [highRisk],
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
