import conditionalApprovalUiSchema from './conditionalApprovalUiSchema';

const conditionalApprovalReadOnlyUiSchema = {
  ...conditionalApprovalUiSchema,
  decision: {
    ...conditionalApprovalUiSchema.decision,
    ministerDecision: {
      'ui:widget': 'ReadOnlyDecisionWidget',
    },
  },
  isedDecisionObj: {
    ...conditionalApprovalUiSchema.isedDecisionObj,
    isedDecision: {
      'ui:widget': 'ReadOnlyDecisionWidget',
    },
  },
  response: {
    ...conditionalApprovalUiSchema.response,
    applicantResponse: {
      'ui:widget': 'ReadOnlyResponseWidget',
    },
    statusApplicantSees: {
      'ui:title': 'Status that applicant sees',
      'ui:widget': 'ReadOnlyStatusWidget',
    },
  },
};

export default conditionalApprovalReadOnlyUiSchema;
