import { graphql } from 'react-relay';
import { updateAnnouncementMutation } from '__generated__/updateAnnouncementMutation.graphql';
import useMutationWithErrorMessage from '../useMutationWithErrorMessage';

const mutation = graphql`
  mutation updateAnnouncementMutation($input: UpdateAnnouncementInput!) {
    updateAnnouncement(input: $input) {
      announcement {
        id
        rowId
        jsonData
      }
    }
  }
`;

const useUpdateAnnouncementMutation = () =>
  useMutationWithErrorMessage<updateAnnouncementMutation>(
    mutation,
    () => 'An error occured while attempting to create the announcement'
  );

export { mutation, useUpdateAnnouncementMutation };
