import { graphql } from 'react-relay';
import { updateRfiJsonDataMutation } from '__generated__/updateRfiJsonDataMutation.graphql';
import useMutationWithErrorMessage from '../useMutationWithErrorMessage';

const mutation = graphql`
  mutation updateRfiJsonDataMutation($input: UpdateRfiDataInput!) {
    updateRfiData(input: $input) {
      rfiData {
        id
        jsonData
      }
    }
  }
`;

const useUpdateRfiJsonDataMutation = () =>
  useMutationWithErrorMessage<updateRfiJsonDataMutation>(
    mutation,
    () => 'An error occurred while attempting to create the application.'
  );

export { mutation, useUpdateRfiJsonDataMutation };
