import { graphql } from 'react-relay';
import { deleteAnnouncementMutation } from '__generated__/deleteAnnouncementMutation.graphql';
import useMutationWithErrorMessage from '../useMutationWithErrorMessage';

const mutation = graphql`
  mutation deleteAnnouncementMutation($input: DeleteAnnouncementInput!) {
    deleteAnnouncement(input: $input) {
    announcement {
      rowId
    }
  }
}
`;

const useDeleteAnnouncementMutation = () =>
  useMutationWithErrorMessage<deleteAnnouncementMutation>(
    mutation,
    () => 'An error occured while attempting to create the announcement'
  );

export { mutation, useDeleteAnnouncementMutation };
