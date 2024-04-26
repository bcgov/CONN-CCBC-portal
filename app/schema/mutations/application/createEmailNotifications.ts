import { graphql } from 'react-relay';
import { createEmailNotificationsMutation } from '__generated__/createEmailNotificationsMutation.graphql';
import useMutationWithErrorMessage from '../useMutationWithErrorMessage';

const mutation = graphql`
  mutation createEmailNotificationsMutation(
    $input: CreateEmailNotificationsInput!
    $connections: [ID!]!
  ) {
    createEmailNotifications(input: $input) {
      clientMutationId
      notifications
        @prependNode(
          connections: $connections
          edgeTypeName: "NotificationsEdge"
        ) {
        id
        applicationId
        notificationType
        createdAt
        jsonData
      }
    }
  }
`;

const useCreateEmailNotificationsMutation = () =>
  useMutationWithErrorMessage<createEmailNotificationsMutation>(
    mutation,
    () =>
      'An error occurred while attempting to create application email notification.'
  );

export { mutation, useCreateEmailNotificationsMutation };
