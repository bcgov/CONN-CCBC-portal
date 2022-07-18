import { graphql } from 'react-relay';
import type { createAttachmentMutation } from '../../../__generated__/createAttachmentMutation.graphql';
import useMutationWithErrorMessage from '../useMutationWithErrorMessage';

const mutation = graphql`
  mutation createAttachmentMutation($input: CreateAttachmentInput!) {
    createAttachment(input: $input) {
      attachment {
        file
      }
    }
  }
`;

const useCreateAttachment = () =>
  useMutationWithErrorMessage<createAttachmentMutation>(
    mutation,
    () => 'An error occurred while attempting to create an attachment.'
  );

export { mutation, useCreateAttachment };
