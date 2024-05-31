import { graphql } from 'react-relay';
import { createCbcPendingChangeRequestMutation } from '__generated__/createCbcPendingChangeRequestMutation.graphql';
import useMutationWithErrorMessage from '../useMutationWithErrorMessage';

const mutation = graphql`
  mutation createCbcPendingChangeRequestMutation(
    $input: CreateCbcPendingChangeRequestInput!
  ) {
    createCbcPendingChangeRequest(input: $input) {
      cbcApplicationPendingChangeRequest {
        isPending
        comment
      }
    }
  }
`;

const useCreateCbcPendingChangeRequestMutation = () =>
  useMutationWithErrorMessage<createCbcPendingChangeRequestMutation>(
    mutation,
    () =>
      'An error occurred while attempting to create Cbc pending change request.'
  );

export { mutation, useCreateCbcPendingChangeRequestMutation };
