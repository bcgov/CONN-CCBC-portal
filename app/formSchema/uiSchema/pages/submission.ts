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
    'ui:widget': 'ReadOnlySubmissionWidget',
    'ui:options': {
      'field-name': 'submissionCompletedFor',
    },
  },
  submissionDate: {
    'ui:widget': 'ReadOnlySubmissionWidget',
  },
};

export default submission;
