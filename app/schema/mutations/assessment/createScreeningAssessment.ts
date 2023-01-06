import { graphql } from 'react-relay';
import { createScreeningAssessmentMutation } from '__generated__/createScreeningAssessmentMutation.graphql';
import useMutationWithErrorMessage from '../useMutationWithErrorMessage';

const mutation = graphql`
  mutation createScreeningAssessmentMutation(
    $input: CreateAssessmentFormInput!
  ) {
    createAssessmentForm(input: $input) {
      assessmentData {
        id
        rowId
        jsonData
      }
    }
  }
`;

const useCreateScreeningAssessmentMutation = () =>
  useMutationWithErrorMessage<createScreeningAssessmentMutation>(
    mutation,
    () => 'An error occured while attempting to create the screening assessment'
  );

export { mutation, useCreateScreeningAssessmentMutation };
