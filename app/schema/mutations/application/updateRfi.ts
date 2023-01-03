import { graphql } from 'react-relay';
import { updateRfiMutation } from '__generated__/updateRfiMutation.graphql';
import useMutationWithErrorMessage from '../useMutationWithErrorMessage';

const mutation = graphql`
  mutation updateRfiMutation($input: UpdateRfiInput!) {
    updateRfi(input: $input) {
      rfiData {
        rfiNumber
        rowId
        id
      }
    }
  }
`;

const useUpdateRfiMutation = () =>
  useMutationWithErrorMessage<updateRfiMutation>(
    mutation,
    () => 'An error occurred while attempting to create the application.'
  );

export { mutation, useUpdateRfiMutation };
