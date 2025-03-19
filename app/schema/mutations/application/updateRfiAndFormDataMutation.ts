import { graphql } from 'react-relay';
import { updateRfiAndFormDataMutation } from '__generated__/updateRfiAndFormDataMutation.graphql';
import useMutationWithErrorMessage from '../useMutationWithErrorMessage';

const mutation = graphql`
  mutation updateRfiAndFormDataMutation(
    $rfiInput: UpdateRfiInput!
    $formInput: CreateNewFormDataInput!
  ) {
    updateRfi(input: $rfiInput) {
      rfiData {
        rfiNumber
        rowId
        id
      }
    }
    createNewFormData(input: $formInput) {
      formData {
        jsonData
      }
    }
  }
`;

const useUpdateRfiAndFormDataMutation = () =>
  useMutationWithErrorMessage<updateRfiAndFormDataMutation>(
    mutation,
    () => 'An error occurred while attempting to create the application.'
  );

export { mutation, useUpdateRfiAndFormDataMutation };
