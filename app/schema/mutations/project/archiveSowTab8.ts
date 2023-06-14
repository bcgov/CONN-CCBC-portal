import { graphql } from 'react-relay';
import { archiveSowTab8Mutation } from '__generated__/archiveSowTab8Mutation.graphql';
import useMutationWithErrorMessage from '../useMutationWithErrorMessage';

const mutation = graphql`
  mutation archiveSowTab8Mutation($input: UpdateSowTab8Input!) {
    updateSowTab8(input: $input) {
      clientMutationId
    }
  }
`;

const useArchiveSowTab8Mutation = () =>
  useMutationWithErrorMessage<archiveSowTab8Mutation>(
    mutation,
    () => 'An error occured while attempting to create the project information'
  );

export { mutation, useArchiveSowTab8Mutation };
