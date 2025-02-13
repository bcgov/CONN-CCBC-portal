import { createTemplateNineDataMutation } from '__generated__/createTemplateNineDataMutation.graphql';
import { graphql } from 'react-relay';
import useMutationWithErrorMessage from '../useMutationWithErrorMessage';

const mutation = graphql`
  mutation createTemplateNineDataMutation(
    $input: CreateApplicationFormTemplate9DataInput!
  ) {
    createApplicationFormTemplate9Data(input: $input) {
      clientMutationId
    }
  }
`;

const useCreateTemplateNineDataMutation = () =>
  useMutationWithErrorMessage<createTemplateNineDataMutation>(
    mutation,
    () => 'An error occurred while attempting to create template nine data.'
  );

export { mutation, useCreateTemplateNineDataMutation };
