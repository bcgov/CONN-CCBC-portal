import { RJSFSchema } from '@rjsf/utils';
import sharedAssessmentFields from './sharedAssessmentFields';

// when a different label and title is needed
// decouple the title from the enum, this is a SonarCloud workaround
// the enum MUST stay as below for data to be maintained
const noDecision = 'No decision';
const eligible = 'Eligible';
const ineligible = 'Ineligible';
const incomplete = 'Incomplete';

const screening: RJSFSchema = {
  title: ' ',
  description: '',
  type: 'object',
  required: [
    'assignedTo',
    'targetDate',
    'nextStep',
    'decision',
    'contestingMap',
    'assessmentTemplate',
    'notesAndConsiderations',
    'otherFiles',
  ],
  properties: {
    ...sharedAssessmentFields.properties,
    decision: {
      title: 'Decision',
      type: 'string',
      enum: [noDecision, eligible, ineligible, incomplete],
      default: 'No decision',
    },
    contestingMap: {
      title: 'Contesting Map',
      type: 'array',
      items: {
        type: 'string',
        enum: ['Applicant is contesting the area map'],
      },
      uniqueItems: true,
    },
    assessmentTemplate: {
      title: 'Assessment template',
      type: 'string',
    },
    notesAndConsiderations: {
      title: 'Notes & Considerations',
      type: 'string',
    },
  },
};

export default screening;
