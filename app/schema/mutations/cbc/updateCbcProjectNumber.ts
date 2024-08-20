import { graphql } from 'react-relay';
import { updateCbcProjectNumberMutation } from '__generated__/updateCbcProjectNumberMutation.graphql';
import useDebouncedMutation from '../useDebouncedMutation';

const mutation = graphql`
  mutation updateCbcProjectNumberMutation(
    $input: UpdateCbcByProjectNumberInput!
  ) {
    updateCbcByProjectNumber(input: $input) {
      clientMutationId
      cbc {
        projectNumber
        rowId
      }
    }
  }
`;

const useUpdateCbcProjectNumberMutation = () =>
  useDebouncedMutation<updateCbcProjectNumberMutation>(
    mutation,
    () => 'An error occurred while attempting to update the cbc data.'
  );

export { mutation, useUpdateCbcProjectNumberMutation };
