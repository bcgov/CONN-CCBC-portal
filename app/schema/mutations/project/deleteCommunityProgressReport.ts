import { graphql } from 'react-relay';
import { deleteCommunityProgressReportMutation } from '__generated__/deleteCommunityProgressReportMutation.graphql';
import useMutationWithErrorMessage from '../useMutationWithErrorMessage';

const mutation = graphql`
mutation deleteCommunityProgressReportMutation($input: DeleteCommunityProgressReportInput! ) {
  deleteCommunityProgressReport(input: $input) {
      clientMutationId
    }
  }
`;

const useDeleteAnnouncementMutation = () =>
  useMutationWithErrorMessage<deleteCommunityProgressReportMutation>(
    mutation,
    () => 'An error occured while attempting to create the announcement'
  );

export { mutation, useDeleteAnnouncementMutation };
