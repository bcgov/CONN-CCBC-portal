import { graphql } from 'react-relay';
import { updateCbcDataAndInsertChangeReasonMutation } from '__generated__/updateCbcDataAndInsertChangeReasonMutation.graphql';
import useDebouncedMutation from '../useDebouncedMutation';

const mutation = graphql`
  mutation updateCbcDataAndInsertChangeReasonMutation(
    $inputCbcData: UpdateCbcDataByRowIdInput!
    $inputCbcChangeReason: CreateCbcDataChangeReasonInput!
    $inputCbcProjectCommunities: EditCbcProjectCommunitiesInput!
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
    editCbcProjectCommunities(input: $inputCbcProjectCommunities) {
      cbcProjectCommunities {
        communitiesSourceDataId
        cbcId
        communitiesSourceDataByCommunitiesSourceDataId {
          geographicNameId
          economicRegion
          regionalDistrict
          bcGeographicName
          geographicType
          rowId
        }
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
