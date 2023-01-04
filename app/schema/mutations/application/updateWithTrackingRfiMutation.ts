import { graphql } from 'react-relay';
import { updateWithTrackingRfiMutation } from '__generated__/updateWithTrackingRfiMutation.graphql';
import useMutationWithErrorMessage from '../useMutationWithErrorMessage';

const mutation = graphql`
  mutation updateWithTrackingRfiMutation($input: UpdateRfiInput!) {
    updateRfi(input: $input) {
      rfiData {
        rfiNumber
        rowId
        id
      }
    }
  }
`;

const useUpdateWithTrackingRfiMutation = () =>
  useMutationWithErrorMessage<updateWithTrackingRfiMutation>(
    mutation,
    () => 'An error occurred while attempting to create the application.'
  );

export { mutation, useUpdateWithTrackingRfiMutation };
