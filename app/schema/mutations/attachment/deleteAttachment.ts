import { graphql } from 'react-relay';
import type { deleteAttachmentMutation } from '../../../__generated__/deleteAttachmentMutation.graphql';
import useMutationWithErrorMessage from '../useMutationWithErrorMessage';

const mutation = graphql`
  mutation deleteAttachmentMutation($input: UpdateAttachmentByRowIdInput!) {
    updateAttachmentByRowId(input: $input) {
      attachment {
        rowId
        isDeleted
      }
    }
  }
`;

const useDeleteAttachment = () =>
  useMutationWithErrorMessage<deleteAttachmentMutation>(
    mutation,
    () => 'An error occurred while attempting to create an attachment.'
  );

export { mutation, useDeleteAttachment };
