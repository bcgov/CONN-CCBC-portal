import { graphql } from 'react-relay';
import { createFeatureFlagMutation } from '__generated__/createFeatureFlagMutation.graphql';
import useMutationWithErrorMessage from '../useMutationWithErrorMessage';

const mutation = graphql`
  mutation createFeatureFlagMutation(
    $connections: [ID!]!
    $input: CreateFeatureFlagInput!
  ) {
    createFeatureFlag(input: $input) {
      featureFlagEdge @appendEdge(connections: $connections) {
        cursor
        node {
          id
          flagKey
          isEnabled
          value
          description
        }
      }
    }
  }
`;

const useCreateFeatureFlagMutation = () =>
  useMutationWithErrorMessage<createFeatureFlagMutation>(
    mutation,
    () => 'An error occurred while attempting to create the feature flag'
  );

export { mutation, useCreateFeatureFlagMutation };
