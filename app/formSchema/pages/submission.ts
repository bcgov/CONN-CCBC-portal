const submission = {
  submission: {
    title: 'Submission',
    description:
      'Certify that you have the authority to submit this information on behalf of the Applicant. After submission, you can continue to edit this application until the intake closes on November 6, 2022 at 9:00AM Pacific Time (PT)',
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
