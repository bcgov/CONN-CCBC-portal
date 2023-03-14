import conditionalApprovalUiSchema from './conditionalApprovalUiSchema';

const conditionalApprovalReadOnlyUiSchema = {
  ...conditionalApprovalUiSchema,
  decision: {
    ...conditionalApprovalUiSchema.decision,
    ministerDecision: {
      'ui:widget': 'ReadOnlyDecisionWidget',
    },
  },
  isedDecision: {
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
  },
};

export default conditionalApprovalReadOnlyUiSchema;
