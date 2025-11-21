import { graphql } from 'react-relay';
import { archiveApplicationMergeMutation } from '__generated__/archiveApplicationMergeMutation.graphql';
import useMutationWithErrorMessage from '../useMutationWithErrorMessage';

const mutation = graphql`
  mutation archiveApplicationMergeMutation(
    $input: ArchiveApplicationMergeInput!
  ) {
    archiveApplicationMerge(input: $input) {
      applicationMerge {
        id
        archivedAt
        parentApplicationId
        parentCbcId
        childApplicationId
      }
    }
  }
`;

const useArchiveApplicationMergeMutation = () =>
  useMutationWithErrorMessage<archiveApplicationMergeMutation>(
    mutation,
    () =>
      'An error occurred while attempting to archive the merge relationship.'
  );

export { mutation, useArchiveApplicationMergeMutation };
