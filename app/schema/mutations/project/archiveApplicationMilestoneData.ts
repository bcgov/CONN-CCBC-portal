import { graphql } from 'react-relay';
import { archiveApplicationMilestoneDataMutation } from '__generated__/archiveApplicationMilestoneDataMutation.graphql';
import useMutationWithErrorMessage from '../useMutationWithErrorMessage';

const mutation = graphql`
  mutation archiveApplicationMilestoneDataMutation(
    $input: ArchiveApplicationMilestoneDataInput!
  ) {
    archiveApplicationMilestoneData(input: $input) {
      clientMutationId
    }
  }
`;

const useArchiveApplicationMilestoneDataMutation = () =>
  useMutationWithErrorMessage<archiveApplicationMilestoneDataMutation>(
    mutation,
    () => 'An error occured while attempting to archive the milestone data.'
  );

export { mutation, useArchiveApplicationMilestoneDataMutation };
