import { graphql } from 'react-relay';
import { updateFeatureFlagMutation } from '__generated__/updateFeatureFlagMutation.graphql';
import useMutationWithErrorMessage from '../useMutationWithErrorMessage';

const mutation = graphql`
  mutation updateFeatureFlagMutation($input: UpdateFeatureFlagInput!) {
    updateFeatureFlag(input: $input) {
      featureFlag {
        id
        flagKey
        isEnabled
        value
        description
      }
    }
  }
`;

const useUpdateFeatureFlagMutation = () =>
  useMutationWithErrorMessage<updateFeatureFlagMutation>(
    mutation,
    () => 'An error occurred while attempting to update the feature flag'
  );

export { mutation, useUpdateFeatureFlagMutation };
