import { graphql } from 'react-relay';

import { createApplicationAnnouncedRecordMutation } from '__generated__/createApplicationAnnouncedRecordMutation.graphql';
import useMutationWithErrorMessage from '../useMutationWithErrorMessage';

const mutation = graphql`
  mutation createApplicationAnnouncedRecordMutation(
    $input: CreateApplicationAnnouncedRecordInput!
  ) {
    createApplicationAnnouncedRecord(input: $input) {
      clientMutationId
      applicationAnnounced {
        announced
        applicationId
        rowId
      }
    }
  }
`;

const useCreateApplicationAnnouncedMutation = () =>
  useMutationWithErrorMessage<createApplicationAnnouncedRecordMutation>(
    mutation,
    () =>
      'An error occurred while attempting to create the application internal description.'
  );

export { mutation, useCreateApplicationAnnouncedMutation };
