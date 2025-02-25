import { graphql } from 'react-relay';
import { saveFnhaContributionMutation } from '__generated__/saveFnhaContributionMutation.graphql';
import useMutationWithErrorMessage from '../useMutationWithErrorMessage';

const mutation = graphql`
  mutation saveFnhaContributionMutation($input: SaveFnhaContributionInput!) {
    saveFnhaContribution(input: $input) {
      applicationFnhaContribution {
        id
        fnhaContribution
        reasonForChange
      }
    }
  }
`;

const useSaveFnhaContributionMutation = () =>
  useMutationWithErrorMessage<saveFnhaContributionMutation>(
    mutation,
    () => 'An error occurred while attempting to update the fnha contribution.'
  );

export { mutation, useSaveFnhaContributionMutation };
