import { graphql } from 'react-relay';
import type { createApplicationAnalystLeadMutation } from '../../../__generated__/createApplicationAnalystLeadMutation.graphql';

import useMutationWithErrorMessage from '../useMutationWithErrorMessage';

const mutation = graphql`
  mutation createApplicationAnalystLeadMutation(
    $input: CreateApplicationAnalystLeadInput!
  ) {
    createApplicationAnalystLead(input: $input) {
      applicationAnalystLead {
        applicationByApplicationId {
          analystLead
        }
      }
    }
  }
`;

const useAssignAnalystMutation = () =>
  useMutationWithErrorMessage<createApplicationAnalystLeadMutation>(
    mutation,
    () => 'An error occurred while attempting to assign the analyst lead.'
  );

export { mutation, useAssignAnalystMutation };
