import type { updateApplicationMutation } from '../../../__generated__/updateApplicationMutation.graphql';
import { graphql } from 'react-relay';

import useMutationWithErrorMessage from '../useMutationWithErrorMessage';

const mutation = graphql`
  mutation updateApplicationMutation($input: UpdateApplicationByOwnerInput!) {
    updateApplicationByOwner(input: $input) {
      clientMutationId
      application {
        formData
        id
        owner
        status
        referenceNumber
      }
    }
  }
`;

const useUpdateApplicationMutation = () =>
  useMutationWithErrorMessage<updateApplicationMutation>(
    mutation,
    () => 'An error occurred while attempting to update the application.'
  );

export { mutation, useUpdateApplicationMutation };
