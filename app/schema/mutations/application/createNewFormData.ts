import { graphql } from 'react-relay';
import type { createNewFormDataMutation } from '../../../__generated__/createNewFormDataMutation.graphql';

import useMutationWithErrorMessage from '../useMutationWithErrorMessage';

const mutation = graphql`
  mutation createNewFormDataMutation($input: CreateNewFormDataInput!) {
    createNewFormData(input: $input) {
      formData {
        jsonData
      }
    }
  }
`;

const useCreateNewFormDataMutation = () =>
  useMutationWithErrorMessage<createNewFormDataMutation>(
    mutation,
    () => 'An error occurred while attempting to create the application.'
  );

export { mutation, useCreateNewFormDataMutation };
