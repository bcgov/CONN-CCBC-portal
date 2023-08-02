import { graphql } from 'react-relay';
import { archiveIntakeMutation } from '__generated__/archiveIntakeMutation.graphql';
import useMutationWithErrorMessage from '../useMutationWithErrorMessage';

const mutation = graphql`
  mutation archiveIntakeMutation($input: ArchiveIntakeInput!) {
    archiveIntake(input: $input) {
      intake {
        archivedAt
        ccbcIntakeNumber
        closeTimestamp
        openTimestamp
      }
    }
  }
`;

const useArchiveIntakeMutation = () =>
  useMutationWithErrorMessage<archiveIntakeMutation>(
    mutation,
    () => 'An error occured while attempting to archive the intake'
  );

export { mutation, useArchiveIntakeMutation };
