import { RJSFSchema } from '@rjsf/utils';
import sharedAssessmentFields from './sharedAssessmentFields';

const technical: RJSFSchema = {
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
    'connectedCoastNetworkDependent',
    'crtcProjectDependent',
  ],
  properties: {
    ...sharedAssessmentFields.properties,
    decision: {
      title: 'Decision',
      type: 'string',
      enum: ['No decision', 'Pass', 'Fail'],
      default: 'No decision',
    },
    completedAssessment: {
      title: 'Completed assessment',
      type: 'string',
    },
    connectedCoastNetworkDependent: {
      title: 'Connected Coast Network Dependent',
      type: 'string',
      default: 'TBD',
      enum: ['TBD', 'Yes', 'No'],
    },
    crtcProjectDependent: {
      title: 'CRTC Project Dependent',
      type: 'string',
      default: 'TBD',
      enum: ['TBD', 'Yes', 'No'],
    },
  },
};

export default technical;
