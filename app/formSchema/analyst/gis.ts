import { RJSFSchema } from '@rjsf/utils';

// when a different label and title is needed
// decouple the title from the enum, this is SonarCloud workaround
// the enum MUST stay as below for data to be maintained
const notStarted = 'Not started';
const needsRFI = 'Needs RFI';
const needs2ndReview = 'Needs 2nd review';
const assessmentComplete = 'Assessment complete';

const gis: RJSFSchema = {
  title: ' ',
  description: '',
  type: 'object',
  required: [
    'assignedTo',
    'targetDate',
    'nextStep',
    'commentsOnCoverageData',
    'commentsOnHouseholdCounts',
    'commentsOnOverbuild',
    'commentsOnOverlap',
  ],
  properties: {
    assignedTo: {
      title: 'Assigned to',
      type: 'string',
    },
    targetDate: {
      title: 'Target date',
      type: 'string',
    },
    nextStep: {
      title: 'Progress',
      type: 'string',
      enum: [notStarted, needsRFI, needs2ndReview, assessmentComplete],
      default: 'Not started',
    },
    commentsOnCoverageData: {
      title: 'Comments on coverage data',
      type: 'string',
    },
    commentsOnHouseholdCounts: {
      title: 'Comments on household counts',
      type: 'string',
    },
    commentsOnOverbuild: {
      title: 'Comments on overbuild',
      type: 'string',
    },
    commentsOnOverlap: {
      title: 'Comments on overlap',
      type: 'string',
    },
  },
};

export default gis;
