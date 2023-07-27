import { graphql } from 'react-relay';
import type { archiveApplicationMutation } from '__generated__/archiveApplicationMutation.graphql';
import useMutationWithErrorMessage from '../useMutationWithErrorMessage';

const mutation = graphql`
  mutation archiveApplicationMutation($input: ArchiveApplicationInput!) {
    archiveApplication(input: $input) {
      application {
        updatedAt
        status
        ccbcNumber
        intakeId
      }
    }
  }
`;

const useArchiveApplicationMutation = () =>
  useMutationWithErrorMessage<archiveApplicationMutation>(
    mutation,
    () => 'An error occurred while archiveing the application.'
  );

export { mutation, useArchiveApplicationMutation };
