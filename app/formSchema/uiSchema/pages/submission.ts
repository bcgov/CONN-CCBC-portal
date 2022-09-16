const submission = {
  'ui:order': [
    'submissionCompletedFor',
    'submissionCompletedBy',
    'submissionTitle',
    'submissionDate',
  ],
  'ui:title': '',
  'ui:field': 'SubmissionField',
  submissionCompletedFor: {
    'ui:widget': 'SubmissionCompletedForWidget',
  },
  submissionDate: {
    'ui:widget': 'ReadOnlySubmissionWidget',
  },
};

export default submission;
