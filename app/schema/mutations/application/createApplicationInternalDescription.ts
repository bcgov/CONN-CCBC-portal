import type { createApplicationInternalDescriptionMutation } from '__generated__/createApplicationInternalDescriptionMutation.graphql';
import { graphql } from 'react-relay';

import useMutationWithErrorMessage from '../useMutationWithErrorMessage';

const mutation = graphql`
  mutation createApplicationInternalDescriptionMutation(
    $input: CreateApplicationInternalDescriptionInput!
  ) {
    createApplicationInternalDescription(input: $input) {
      clientMutationId
      applicationInternalDescription {
        description
      }
    }
  }
`;

const useCreateApplicationInternalDescriptionMutation = () =>
  useMutationWithErrorMessage<createApplicationInternalDescriptionMutation>(
    mutation,
    () =>
      'An error occurred while attempting to create the application internal description.'
  );

export { mutation, useCreateApplicationInternalDescriptionMutation };
