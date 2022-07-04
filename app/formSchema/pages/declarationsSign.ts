const declarationsSign = {
  declarationsSign: {
    title: 'Declarations',
    description:
      'You certify that you have the authority to submit this information on behalf of the applicant.',
    type: 'object',
    required: [
      'declarationsCompletedFor',
      'declarationsDate',
      'declarationsCompletedBy',
      'declarationsTitle',
    ],
    properties: {
      declarationsCompletedFor: {
        title: 'Completed for (applicant Name)',
        type: 'string',
      },
      declarationsDate: {
        title: 'On this date (YYYY-MM-DD)',
        type: 'string',
      },
      declarationsCompletedBy: {
        title: 'Completed by',
        type: 'string',
      },
      declarationsTitle: {
        title: 'Title',
        type: 'string',
      },
    },
  },
};

export default declarationsSign;
