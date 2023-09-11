import { graphql } from 'react-relay';
import { createMilestoneDataMutation } from '__generated__/createMilestoneDataMutation.graphql';
import useMutationWithErrorMessage from '../useMutationWithErrorMessage';

const mutation = graphql`
  mutation createMilestoneDataMutation(
    $connections: [ID!]!
    $input: CreateApplicationMilestoneDataInput!
  ) {
    createApplicationMilestoneData(input: $input) {
      applicationMilestoneDataEdge @appendEdge(connections: $connections) {
        node {
          id
          jsonData
          rowId
          excelDataId
          applicationByApplicationId {
            applicationMilestoneExcelDataByApplicationId {
              nodes {
                rowId
                jsonData
              }
            }
          }
        }
      }
    }
  }
`;

const useCreateMilestoneMutation = () =>
  useMutationWithErrorMessage<createMilestoneDataMutation>(
    mutation,
    () => 'An error occurred while attempting to create the milestone'
  );

export { mutation, useCreateMilestoneMutation };
