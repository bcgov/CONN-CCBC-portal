import { graphql } from 'react-relay';
import type { createRfiMutation } from '../../../__generated__/createRfiMutation.graphql';

import useMutationWithErrorMessage from '../useMutationWithErrorMessage';

const mutation = graphql`
  mutation createRfiMutation($input: CreateRfiInput!) {
    createRfi(input: $input) {
      rfiData {
        rfiNumber
      }
    }
  }
`;

const useCreateRfiMutation = () =>
  useMutationWithErrorMessage<createRfiMutation>(
    mutation,
    () => 'An error occurred while attempting to create the application.'
  );

export { mutation, useCreateRfiMutation };
