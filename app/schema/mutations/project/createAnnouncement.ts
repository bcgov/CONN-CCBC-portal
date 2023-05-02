import { graphql } from 'react-relay';
import { createAnnouncementMutation } from '__generated__/createAnnouncementMutation.graphql';
import useMutationWithErrorMessage from '../useMutationWithErrorMessage';

const mutation = graphql`
  mutation createAnnouncementMutation(
    $connections: [ID!]!
    $input: CreateAnnouncementInput!
  ) {
    createAnnouncement(input: $input) {
      announcementEdge @appendEdge(connections: $connections) {
        cursor
        node {
          id
          jsonData
          rowId
        }
      }
    }
  }
`;

const useCreateAnnouncementMutation = () =>
  useMutationWithErrorMessage<createAnnouncementMutation>(
    mutation,
    () => 'An error occured while attempting to create the announcement'
  );

export { mutation, useCreateAnnouncementMutation };
