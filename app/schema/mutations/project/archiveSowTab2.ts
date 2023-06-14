import { graphql } from 'react-relay';
import { archiveSowTab2Mutation } from '__generated__/archiveSowTab2Mutation.graphql';
import useMutationWithErrorMessage from '../useMutationWithErrorMessage';

const mutation = graphql`
  mutation archiveSowTab2Mutation($input: UpdateSowTab2Input!) {
    updateSowTab2(input: $input) {
      clientMutationId
    }
  }
`;

const useArchiveSowTab2Mutation = () =>
  useMutationWithErrorMessage<archiveSowTab2Mutation>(
    mutation,
    () => 'An error occured while attempting to create the project information'
  );

export { mutation, useArchiveSowTab2Mutation };
