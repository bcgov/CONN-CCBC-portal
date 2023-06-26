import { graphql } from 'react-relay';
import { archiveApplicationSowMutation } from '__generated__/archiveApplicationSowMutation.graphql';
import useMutationWithErrorMessage from '../useMutationWithErrorMessage';

const mutation = graphql`
  mutation archiveApplicationSowMutation($input: ArchiveApplicationSowInput!) {
    archiveApplicationSow(input: $input) {
      clientMutationId
    }
  }
`;

const useArchiveApplicationSowMutation = () =>
  useMutationWithErrorMessage<archiveApplicationSowMutation>(
    mutation,
    () => 'An error occured while attempting to create the project information'
  );

export { mutation, useArchiveApplicationSowMutation };
