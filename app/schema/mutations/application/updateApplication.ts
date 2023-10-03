import { graphql } from 'react-relay';
import { updateApplicationMutation } from '__generated__/updateApplicationMutation.graphql';
import useMutationWithErrorMessage from '../useMutationWithErrorMessage';

const mutation = graphql`
  mutation updateApplicationMutation($input: UpdateApplicationByRowIdInput!) {
    updateApplicationByRowId(input: $input) {
      application {
        internalDescription
        id
        rowId
      }
    }
  }
`;

const useUpdateApplicationMutation = () =>
  useMutationWithErrorMessage<updateApplicationMutation>(
    mutation,
    () => 'An error occurred while attempting to create the application.'
  );

export { mutation, useUpdateApplicationMutation };
