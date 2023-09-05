import { graphql } from 'react-relay';
import { createClaimsDataMutation } from '__generated__/createClaimsDataMutation.graphql';
import useMutationWithErrorMessage from '../useMutationWithErrorMessage';

const mutation = graphql`
  mutation createClaimsDataMutation(
    $connections: [ID!]!
    $input: CreateApplicationClaimsDataInput!
  ) {
    createApplicationClaimsData(input: $input) {
      applicationClaimsDataEdge @appendEdge(connections: $connections) {
        node {
          id
          jsonData
          rowId
          excelDataId
          applicationByApplicationId {
            applicationClaimsExcelDataByApplicationId {
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

const useCreateClaimsMutation = () =>
  useMutationWithErrorMessage<createClaimsDataMutation>(
    mutation,
    () => 'An error occurred while attempting to create the claims'
  );

export { mutation, useCreateClaimsMutation };
