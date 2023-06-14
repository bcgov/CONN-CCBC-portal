import { graphql } from 'react-relay';
import { archiveSowTab1Mutation } from '__generated__/archiveSowTab1Mutation.graphql';
import useMutationWithErrorMessage from '../useMutationWithErrorMessage';

const mutation = graphql`
  mutation archiveSowTab1Mutation($input: UpdateSowTab1Input!) {
    updateSowTab1(input: $input) {
      clientMutationId
    }
  }
`;

const useArchiveSowTab1Mutation = () =>
  useMutationWithErrorMessage<archiveSowTab1Mutation>(
    mutation,
    () => 'An error occured while attempting to create the project information'
  );

export { mutation, useArchiveSowTab1Mutation };
