import { graphql } from 'react-relay';
import { archiveSowApplicationMutation } from '__generated__/archiveSowApplicationMutation.graphql';
import useMutationWithErrorMessage from '../useMutationWithErrorMessage';

const mutation = graphql`
  mutation archiveSowApplicationMutation(
    $input: UpdateApplicationSowDataInput!
  ) {
    updateApplicationSowData(input: $input) {
      clientMutationId
    }
  }
`;

const useArchiveSowApplicationMutation = () =>
  useMutationWithErrorMessage<archiveSowApplicationMutation>(
    mutation,
    () => 'An error occured while attempting to create the project information'
  );

export { mutation, useArchiveSowApplicationMutation };
