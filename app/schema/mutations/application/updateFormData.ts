import type { updateFormDataMutation } from '__generated__/updateFormDataMutation.graphql';
import { graphql } from 'react-relay';

import useDebouncedMutation from '../useDebouncedMutation';

const mutation = graphql`
  mutation updateFormDataMutation($input: UpdateFormDataInput!) {
    updateFormData(input: $input) {
      formData {
        jsonData
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

const useUpdateFormData = () =>
  useDebouncedMutation<updateFormDataMutation>(
    mutation,
    () => 'An error occurred while attempting to update the application.'
  );

export { mutation, useUpdateFormData };
