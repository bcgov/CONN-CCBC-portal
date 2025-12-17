import type { updateApplicationInternalNoteMutation } from '__generated__/updateApplicationInternalNoteMutation.graphql';
import { graphql } from 'react-relay';

import useMutationWithErrorMessage from '../useMutationWithErrorMessage';

const mutation = graphql`
  mutation updateApplicationInternalNoteMutation(
    $input: UpdateApplicationInternalNoteInput!
  ) {
    updateApplicationInternalNote(input: $input) {
      clientMutationId
      applicationInternalNote {
        id
        rowId
        note
      }
    }
  }
`;

const useUpdateApplicationInternalNoteMutation = () =>
  useMutationWithErrorMessage<updateApplicationInternalNoteMutation>(
    mutation,
    () =>
      'An error occurred while attempting to update the application internal note.'
  );

export { mutation, useUpdateApplicationInternalNoteMutation };

