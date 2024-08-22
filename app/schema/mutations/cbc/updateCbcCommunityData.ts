import { graphql } from 'react-relay';
import { updateCbcCommunityDataMutation } from '__generated__/updateCbcCommunityDataMutation.graphql';
import useDebouncedMutation from '../useDebouncedMutation';

const mutation = graphql`
  mutation updateCbcCommunityDataMutation(
    $input: EditCbcProjectCommunitiesInput!
  ) {
    editCbcProjectCommunities(input: $input) {
      cbcProjectCommunities {
        communitiesSourceDataId
        cbcId
        communitiesSourceDataByCommunitiesSourceDataId {
          geographicNameId
          economicRegion
          regionalDistrict
          bcGeographicName
        }
      }
    }
  }
`;

const useUpdateCbcCommunityDataMutationMutation = () =>
  useDebouncedMutation<updateCbcCommunityDataMutation>(
    mutation,
    () => 'An error occurred while attempting to update the cbc data.'
  );

export { mutation, useUpdateCbcCommunityDataMutationMutation };
