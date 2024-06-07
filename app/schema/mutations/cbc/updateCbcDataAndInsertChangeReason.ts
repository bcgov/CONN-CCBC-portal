import { graphql } from 'react-relay';
import { updateCbcDataAndInsertChangeReasonMutation } from '__generated__/updateCbcDataAndInsertChangeReasonMutation.graphql';
import useDebouncedMutation from '../useDebouncedMutation';

const mutation = graphql`
  mutation updateCbcDataAndInsertChangeReasonMutation(
    $inputCbcData: UpdateCbcDataByRowIdInput!
    $inputCbcChangeReason: CreateCbcDataChangeReasonInput!
  ) {
    updateCbcDataByRowId(input: $inputCbcData) {
      cbcData {
        id
        rowId
        jsonData
        updatedAt
      }
    }
    createCbcDataChangeReason(input: $inputCbcChangeReason) {
      cbcDataChangeReason {
        id
        cbcDataId
        description
        createdBy
        createdAt
      }
    }
  }
`;

const useUpdateCbcDataAndInsertChangeRequest = () =>
  useDebouncedMutation<updateCbcDataAndInsertChangeReasonMutation>(
    mutation,
    () => 'An error occurred while attempting to update the cbc data.'
  );

export { mutation, useUpdateCbcDataAndInsertChangeRequest };
