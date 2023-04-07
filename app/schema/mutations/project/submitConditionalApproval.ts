import { graphql } from 'react-relay';
import { submitConditionalApprovalMutation } from '__generated__/submitConditionalApprovalMutation.graphql';
import useMutationWithErrorMessage from '../useMutationWithErrorMessage';

const mutation = graphql`
  mutation submitConditionalApprovalMutation(
    $input: SubmitConditionallyApprovedInput!
  ) {
    submitConditionallyApproved(input: $input) {
      conditionalApprovalData {
        id
        jsonData
        rowId
      }
    }
  }
`;

const useSubmitConditionalApprovalMutation = () =>
  useMutationWithErrorMessage<submitConditionalApprovalMutation>(
    mutation,
    () => 'An error occured while attempting to submit the conditional approval'
  );

export { mutation, useSubmitConditionalApprovalMutation };
