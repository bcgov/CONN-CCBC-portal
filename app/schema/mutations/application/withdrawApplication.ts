
import { graphql } from 'react-relay';
import type { withdrawApplicationMutation } from '__generated__/withdrawApplicationMutation.graphql';
import useMutationWithErrorMessage from '../useMutationWithErrorMessage';

const mutation = graphql`
  mutation withdrawApplicationMutation($input: WithdrawApplicationInput!) {
    withdrawApplication(input: $input) {
      application {
        updatedAt
        status
        ccbcNumber
        intakeId
      }
    }
  }
`;

const useWithdrawApplicationMutation = () =>
  useMutationWithErrorMessage<withdrawApplicationMutation>(
    mutation,
    () => 'An error occurred while withdrawing the application.'
  );

export { mutation, useWithdrawApplicationMutation };
