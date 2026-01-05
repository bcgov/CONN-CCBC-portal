import type { createApplicationInternalNoteMutation } from '__generated__/createApplicationInternalNoteMutation.graphql';
import { graphql } from 'react-relay';

import useMutationWithErrorMessage from '../useMutationWithErrorMessage';

const mutation = graphql`
  mutation createApplicationInternalNoteMutation(
    $input: CreateApplicationInternalNoteInput!
  ) {
    createApplicationInternalNote(input: $input) {
      clientMutationId
      applicationInternalNote {
        id
        rowId
        note
      }
    }
  }
`;

const useCreateApplicationInternalNoteMutation = () =>
  useMutationWithErrorMessage<createApplicationInternalNoteMutation>(
    mutation,
    () =>
      'An error occurred while attempting to create the application internal note.'
  );

export { mutation, useCreateApplicationInternalNoteMutation };

