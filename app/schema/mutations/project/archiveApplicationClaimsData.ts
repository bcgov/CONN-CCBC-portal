import { graphql } from 'react-relay';
import { archiveApplicationClaimsDataMutation } from '__generated__/archiveApplicationClaimsDataMutation.graphql';
import useMutationWithErrorMessage from '../useMutationWithErrorMessage';

const mutation = graphql`
  mutation archiveApplicationClaimsDataMutation(
    $input: ArchiveApplicationClaimsDataInput!
  ) {
    archiveApplicationClaimsData(input: $input) {
      clientMutationId
    }
  }
`;

const useArchiveApplicationClaimsDataMutation = () =>
  useMutationWithErrorMessage<archiveApplicationClaimsDataMutation>(
    mutation,
    () => 'An error occured while attempting to archive the claims data.'
  );

export { mutation, useArchiveApplicationClaimsDataMutation };
