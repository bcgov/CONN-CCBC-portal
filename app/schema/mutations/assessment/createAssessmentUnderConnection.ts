import { graphql } from 'react-relay';
import { createAssessmentUnderConnectionMutation } from '__generated__/createAssessmentUnderConnectionMutation.graphql';
import useMutationWithErrorMessage from '../useMutationWithErrorMessage';

const mutation = graphql`
  mutation createAssessmentUnderConnectionMutation(
    $connections: [ID!]!
    $input: CreateAssessmentFormInput!
  ) {
    createAssessmentForm(input: $input) {
      assessmentDataEdge @appendEdge(connections: $connections) {
        cursor
        node {
          id
          rowId
          jsonData
          createdAt
        }
      }
    }
  }
`;

const useCreateAssessmentUnderConnectionMutation = () =>
  useMutationWithErrorMessage<createAssessmentUnderConnectionMutation>(
    mutation,
    () => 'An error occured while attempting to create the assessment'
  );

export { mutation, useCreateAssessmentUnderConnectionMutation };
