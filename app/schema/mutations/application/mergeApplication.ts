import { graphql } from 'react-relay';
import { mergeApplicationMutation } from '__generated__/mergeApplicationMutation.graphql';
import useMutationWithErrorMessage from '../useMutationWithErrorMessage';

const mutation = graphql`
  mutation mergeApplicationMutation($input: MergeApplicationInput!) {
    mergeApplication(input: $input) {
      applicationMerge {
        id
        parentApplicationId
        parentCbcId
        childApplicationId
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
