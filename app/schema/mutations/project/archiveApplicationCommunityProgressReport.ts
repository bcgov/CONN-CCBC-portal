import { graphql } from 'react-relay';
import { archiveApplicationCommunityProgressReportMutation } from '__generated__/archiveApplicationCommunityProgressReportMutation.graphql';
import useMutationWithErrorMessage from '../useMutationWithErrorMessage';

const mutation = graphql`
  mutation archiveApplicationCommunityProgressReportMutation(
    $input: ArchiveApplicationCommunityProgressReportInput!
  ) {
    archiveApplicationCommunityProgressReport(input: $input) {
      clientMutationId
    }
  }
`;

const useArchiveApplicationCommunityProgressReportMutation = () =>
  useMutationWithErrorMessage<archiveApplicationCommunityProgressReportMutation>(
    mutation,
    () => 'An error occured while attempting to create the project information'
  );

export { mutation, useArchiveApplicationCommunityProgressReportMutation };
