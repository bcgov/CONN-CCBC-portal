import type { submitApplicationMutation } from '__generated__/submitApplicationMutation.graphql';
import { graphql } from 'react-relay';
import useMutationWithErrorMessage from '../useMutationWithErrorMessage';

const mutation = graphql`
  mutation submitApplicationMutation($input: SubmitApplicationInput!) {
    submitApplication(input: $input) {
      application {
        updatedAt
        status
        ccbcNumber
        intakeId
      }
    }
  }
`;

const useSubmitApplicationMutation = () =>
  useMutationWithErrorMessage<submitApplicationMutation>(
    mutation,
    () => 'An error occurred while submitting the application.'
  );

export { mutation, useSubmitApplicationMutation };
