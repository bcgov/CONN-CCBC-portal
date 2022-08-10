import type { updateApplicationMutation } from '../../../__generated__/updateApplicationMutation.graphql';
import { graphql } from 'react-relay';

import useDebouncedMutation from '../useDebouncedMutation';

const mutation = graphql`
  mutation updateApplicationMutation($input: UpdateApplicationInput!) {
    updateApplication(input: $input) {
      application {
        formData
        updatedAt
      }
    }
  }
`;

const useUpdateApplicationMutation = () =>
  useDebouncedMutation<updateApplicationMutation>(
    mutation,
    () => 'An error occurred while attempting to update the application.'
  );

export { mutation, useUpdateApplicationMutation };
