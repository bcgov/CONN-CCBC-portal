import { graphql } from 'react-relay';
import { createCommunityProgressReportMutation } from '__generated__/createCommunityProgressReportMutation.graphql';
import useMutationWithErrorMessage from '../useMutationWithErrorMessage';

const mutation = graphql`
  mutation createCommunityProgressReportMutation(
    $connections: [ID!]!
    $input: CreateApplicationCommunityProgressReportDataInput!
  ) {
    createApplicationCommunityProgressReportData(input: $input) {
      applicationCommunityProgressReportDataEdge
        @appendEdge(connections: $connections) {
        node {
          id
          jsonData
          rowId
        }
      }
    }
  }
`;

const useCreateCommunityProgressReportMutation = () =>
  useMutationWithErrorMessage<createCommunityProgressReportMutation>(
    mutation,
    () =>
      'An error occurred while attempting to create the community progress report'
  );

export { mutation, useCreateCommunityProgressReportMutation };
