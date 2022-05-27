import type { createApplicationMutation } from '../../../__generated__/createApplicationMutation.graphql';
import { graphql } from 'react-relay';

import useMutationWithErrorMessage from '../useMutationWithErrorMessage';

const mutation = graphql`
  mutation createApplicationMutation($input: CreateApplicationInput!) {
    createApplication(input: $input) {
      clientMutationId
    }
  }
`;

const useCreateApplicationMutation = () =>
  useMutationWithErrorMessage<createApplicationMutation>(
    mutation,
    () => 'An error occurred while attempting to create the application.'
  );

export { mutation, useCreateApplicationMutation };
