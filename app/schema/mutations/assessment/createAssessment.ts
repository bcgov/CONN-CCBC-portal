import { graphql } from 'react-relay';
import { createAssessmentMutation } from '__generated__/createAssessmentMutation.graphql';
import useMutationWithErrorMessage from '../useMutationWithErrorMessage';

const mutation = graphql`
  mutation createAssessmentMutation($input: CreateAssessmentFormInput!) {
    createAssessmentForm(input: $input) {
      assessmentData {
        id
        rowId
        jsonData
        createdAt
      }
    }
  }
`;

const useCreateAssessmentMutation = () =>
  useMutationWithErrorMessage<createAssessmentMutation>(
    mutation,
    () => 'An error occured while attempting to create the assessment'
  );

export { mutation, useCreateAssessmentMutation };
