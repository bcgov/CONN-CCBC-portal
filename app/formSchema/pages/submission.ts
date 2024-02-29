import { RJSFSchema } from '@rjsf/utils';

const submission: Record<string, RJSFSchema> = {
  submission: {
    title: 'Submission',
    // description is rendered and stored in the SubmissionField.tsx
    type: 'object',
    required: [
      'submissionCompletedFor',
      'submissionDate',
      'submissionCompletedBy',
      'submissionTitle',
    ],
    properties: {
      submissionCompletedFor: {
        title: 'Completed for (Legal organization name)',
        type: 'string',
      },
      submissionCompletedBy: {
        title: 'Completed by',
        type: 'string',
      },
      submissionTitle: {
        title: 'Title',
        type: 'string',
      },
      submissionDate: {
        title: 'On this date (YYYY-MM-DD)',
        type: 'string',
      },
    },
  },
};

export default submission;
