import { graphql } from 'react-relay';
import { updateIntakeMutation } from '__generated__/updateIntakeMutation.graphql';
import useMutationWithErrorMessage from '../useMutationWithErrorMessage';

const mutation = graphql`
  mutation updateIntakeMutation($input: UpdateIntakeInput!) {
    updateIntake(input: $input) {
      intake {
        id
        openTimestamp
        rowId
        description
        closeTimestamp
        ccbcIntakeNumber
      }
    }
  }
`;

const useUpdateIntakeMutation = () =>
  useMutationWithErrorMessage<updateIntakeMutation>(
    mutation,
    () => 'An error occured while attempting to update the intake'
  );

export { mutation, useUpdateIntakeMutation };
