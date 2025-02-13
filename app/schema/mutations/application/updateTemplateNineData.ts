import { updateTemplateNineDataMutation } from '__generated__/updateTemplateNineDataMutation.graphql';
import { graphql } from 'react-relay';
import useMutationWithErrorMessage from '../useMutationWithErrorMessage';

const mutation = graphql`
  mutation updateTemplateNineDataMutation(
    $input: UpdateApplicationFormTemplate9DataByRowIdInput!
  ) {
    updateApplicationFormTemplate9DataByRowId(input: $input) {
      clientMutationId
    }
  }
`;

const useUpdateTemplateNineDataMutation = () =>
  useMutationWithErrorMessage<updateTemplateNineDataMutation>(
    mutation,
    () => 'An error occurred while attempting to update template nine data.'
  );

export { mutation, useUpdateTemplateNineDataMutation };
