import { JSONSchema7 } from 'json-schema';
import sharedAssessmentFields from './sharedAssessmentFields';

const screening: JSONSchema7 = {
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
      enum: ['Eligible', 'Ineligible', 'Incomplete'],
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
