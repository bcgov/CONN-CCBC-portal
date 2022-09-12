import { ReadOnlySubmissionWidget } from '../../../lib/theme/widgets';

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
    'ui:widget': ReadOnlySubmissionWidget,
  },
  submissionDate: {
    'ui:widget': ReadOnlySubmissionWidget,
  },
};

export default submission;
