import { graphql } from 'react-relay';
import { archiveReportingGcpeMutation } from '__generated__/archiveReportingGcpeMutation.graphql';
import useMutationWithErrorMessage from '../useMutationWithErrorMessage';

const mutation = graphql`
  mutation archiveReportingGcpeMutation(
    $input: UpdateReportingGcpeByRowIdInput!
  ) {
    updateReportingGcpeByRowId(input: $input) {
      reportingGcpe {
        id
        archivedAt
        createdAt
      }
    }
  }
`;

const useArchiveReportingGcpeMutation = () =>
  useMutationWithErrorMessage<archiveReportingGcpeMutation>(
    mutation,
    () => 'An error occured while attempting to archive the intake'
  );

export { mutation, useArchiveReportingGcpeMutation };
