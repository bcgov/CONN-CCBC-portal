import { graphql } from 'react-relay';
import { mergeApplicationMutation } from '__generated__/mergeApplicationMutation.graphql';
import useMutationWithErrorMessage from '../useMutationWithErrorMessage';

const mutation = graphql`
  mutation mergeApplicationMutation(
    $input: MergeApplicationInput!
    $connections: [ID!]!
  ) {
    mergeApplication(input: $input) {
      applicationMerge
        @prependNode(
          connections: $connections
          edgeTypeName: "ApplicationMergesEdge"
        ) {
        id
        parentApplicationId
        parentCbcId
        childApplicationId
        changeReason
      }
    }
  }
`;

const useMergeApplicationMutation = () =>
  useMutationWithErrorMessage<mergeApplicationMutation>(
    mutation,
    () => 'An error occurred while attempting to save the merge parent.'
  );

export { mutation, useMergeApplicationMutation };
