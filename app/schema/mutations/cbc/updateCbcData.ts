import { graphql } from 'react-relay';
import { updateCbcDataByRowIdMutation } from '__generated__/updateCbcDataByRowIdMutation.graphql';
import useDebouncedMutation from '../useDebouncedMutation';

const mutation = graphql`
  mutation updateCbcDataByRowIdMutation($input: UpdateCbcDataByRowIdInput!) {
    updateCbcDataByRowId(input: $input) {
      cbcData {
        id
        rowId
        jsonData
        updatedAt
      }
    }
  }
`;

const useUpdateCbcDataByRowIdMutation = () =>
  useDebouncedMutation<updateCbcDataByRowIdMutation>(
    mutation,
    () => 'An error occurred while attempting to update the cbc data.'
  );

export { mutation, useUpdateCbcDataByRowIdMutation };
