import { graphql } from 'react-relay';
import { createApplicationStatusMutation } from '__generated__/createApplicationStatusMutation.graphql';
import useMutationWithErrorMessage from '../useMutationWithErrorMessage';

const mutation = graphql`
  mutation createApplicationStatusMutation(
    $input: CreateApplicationStatusInput!
  ) {
    createApplicationStatus(input: $input) {
      applicationStatus {
        status
      }
    }
  }
`;

const useCreateApplicationStatusMutation = () =>
  useMutationWithErrorMessage<createApplicationStatusMutation>(
    mutation,
    () => 'An error occured while attempting to create the screening assessment'
  );

export { mutation, useCreateApplicationStatusMutation };
