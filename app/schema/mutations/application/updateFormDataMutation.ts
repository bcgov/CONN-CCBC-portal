import type { updateFormDataMutation } from '__generated__/updateFormDataMutation.graphql';
import { graphql } from 'react-relay';

import useDebouncedMutation from '../useDebouncedMutation';

const mutation = graphql`
  mutation updateFormDataMutation($input: UpdateFormDataByRowIdInput!) {
    updateFormDataByRowId(input: $input) {
      formData{
        rowId
        formData
        applicationsByApplicationFormDataFormDataIdAndApplicationId {
          edges {
            node {
              ...ApplicationForm_application
            }
          }
        }
      }
    }
  }
`;

const useUpdateFormDataMutation = () =>
  useDebouncedMutation<updateFormDataMutation>(
    mutation,
    () => 'An error occurred while attempting to update the application.'
  );

export { mutation, useUpdateFormDataMutation };
