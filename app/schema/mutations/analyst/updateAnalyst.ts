import { graphql } from 'react-relay';
import { updateAnalystMutation } from '__generated__/updateAnalystMutation.graphql';
import useMutationWithErrorMessage from '../useMutationWithErrorMessage';

const mutation = graphql`
  mutation updateAnalystMutation($input: UpdateAnalystInput!) {
    updateAnalyst(input: $input) {
      analyst {
        id
      }
    }
  }
`;

const useUpdateAnalystMutation = () =>
  useMutationWithErrorMessage<updateAnalystMutation>(
    mutation,
    () => 'An error occured while attempting to create the screening assessment'
  );

export { mutation, useUpdateAnalystMutation };
