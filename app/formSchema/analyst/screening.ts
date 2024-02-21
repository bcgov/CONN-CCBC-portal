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
          title: eligible,
          enum: [eligible],
        },
        {
          title: ineligible,
          enum: [ineligible],
        },
        {
          title: incomplete,
          enum: [incomplete],
        },
      ],
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
  },
};

export default screening;
