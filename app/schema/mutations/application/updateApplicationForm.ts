import type { updateApplicationFormMutation } from '__generated__/updateApplicationFormMutation.graphql';
import { graphql } from 'react-relay';

import useDebouncedMutation from '../useDebouncedMutation';

const mutation = graphql`
  mutation updateApplicationFormMutation($input: UpdateApplicationFormInput!) {
    updateApplicationForm(input: $input) {
      formData {
        id
        jsonData
        updatedAt
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

const useUpdateApplicationForm = () =>
  useDebouncedMutation<updateApplicationFormMutation>(
    mutation,
    () => 'An error occurred while attempting to update the application.'
  );

export { mutation, useUpdateApplicationForm };
