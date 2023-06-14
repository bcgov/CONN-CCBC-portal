import { graphql } from 'react-relay';
import { archiveSowTab7Mutation } from '__generated__/archiveSowTab7Mutation.graphql';
import useMutationWithErrorMessage from '../useMutationWithErrorMessage';

const mutation = graphql`
  mutation archiveSowTab7Mutation($input: UpdateSowTab7Input!) {
    updateSowTab7(input: $input) {
      clientMutationId
    }
  }
`;

const useArchiveSowTab7Mutation = () =>
  useMutationWithErrorMessage<archiveSowTab7Mutation>(
    mutation,
    () => 'An error occured while attempting to create the project information'
  );

export { mutation, useArchiveSowTab7Mutation };
