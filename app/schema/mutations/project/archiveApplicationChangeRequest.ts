import { graphql } from 'react-relay';
import { archiveApplicationChangeRequestMutation } from '__generated__/archiveApplicationChangeRequestMutation.graphql';
import useMutationWithErrorMessage from '../useMutationWithErrorMessage';

const mutation = graphql`
  mutation archiveApplicationChangeRequestMutation(
    $input: ArchiveApplicationChangeRequestInput!
  ) {
    archiveApplicationChangeRequest(input: $input) {
      clientMutationId
    }
  }
`;

const useArchiveApplicationChangeRequestMutation = () =>
  useMutationWithErrorMessage<archiveApplicationChangeRequestMutation>(
    mutation,
    () => 'An error occurred while attempting to archive the change request.'
  );

export { mutation, useArchiveApplicationChangeRequestMutation };
