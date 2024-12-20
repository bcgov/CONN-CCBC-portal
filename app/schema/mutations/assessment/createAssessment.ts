import { graphql } from 'react-relay';
import { createAssessmentMutation } from '__generated__/createAssessmentMutation.graphql';
import useMutationWithErrorMessage from '../useMutationWithErrorMessage';

const mutation = graphql`
  mutation createAssessmentMutation(
    $input: CreateAssessmentFormInput!
    $connections: [ID!]!
  ) {
    createAssessmentForm(input: $input) {
      assessmentFormResult {
        assessmentData
          @prependNode(
            connections: $connections
            edgeTypeName: "AssessmentDataEdge"
          ) {
          id
          rowId
          jsonData
          createdAt
          updatedAt
          updatedBy
          assessmentDataType
        }
        applicationDependencies {
          id
          jsonData
        }
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
