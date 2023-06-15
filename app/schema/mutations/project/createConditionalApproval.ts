import { graphql } from 'react-relay';
import { createConditionalApprovalMutation } from '__generated__/createConditionalApprovalMutation.graphql';
import useMutationWithErrorMessage from '../useMutationWithErrorMessage';

const mutation = graphql`
  mutation createConditionalApprovalMutation(
    $connections: [ID!]!
    $input: CreateConditionalApprovalInput!
  ) {
    createConditionalApproval(input: $input) {
      conditionalApprovalDataEdge @appendEdge(connections: $connections) {
        cursor
        node {
          id
          jsonData
          rowId
        }
      }
    }
  }
`;

const useCreateConditionalApprovalMutation = () =>
  useMutationWithErrorMessage<createConditionalApprovalMutation>(
    mutation,
    () => 'An error occured while attempting to create the conditional approval'
  );

export { mutation, useCreateConditionalApprovalMutation };
