import { graphql } from 'react-relay';
import { createPendingChangeRequestMutation } from '__generated__/createPendingChangeRequestMutation.graphql';
import useMutationWithErrorMessage from '../useMutationWithErrorMessage';

const mutation = graphql`
  mutation createPendingChangeRequestMutation(
    $input: CreatePendingChangeRequestInput!
  ) {
    createPendingChangeRequest(input: $input) {
      applicationPendingChangeRequest {
        isPending
        comment
      }
    }
  }
`;

const useCreatePendingChangeRequestMutation = () =>
  useMutationWithErrorMessage<createPendingChangeRequestMutation>(
    mutation,
    () =>
      'An error occurred while attempting to create application pending change request.'
  );

export { mutation, useCreatePendingChangeRequestMutation };
