import { JSONSchema7 } from 'json-schema';

const submission: Record<string, JSONSchema7> = {
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
