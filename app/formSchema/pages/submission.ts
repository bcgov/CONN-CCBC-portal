const submission = {
  submission: {
    title: 'Submission',
    description:
      'You certify that you have the authority to submit this information on behalf of the Applicant.',
    type: 'object',
    required: [
      'submissionCompletedFor',
      'submissionDate',
      'submissionCompletedBy',
      'submissionTitle',
    ],
    properties: {
      submissionCompletedFor: {
        title: 'Completed for (Applicant Name)',
        type: 'string',
      },
      submissionDate: {
        title: 'On this date (YYYY-MM-DD)',
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
    },
  },
};

export default submission;
