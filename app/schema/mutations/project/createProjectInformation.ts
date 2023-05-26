import { graphql } from 'react-relay';
import { createProjectInformationMutation } from '__generated__/createProjectInformationMutation.graphql';
import useMutationWithErrorMessage from '../useMutationWithErrorMessage';

const mutation = graphql`
  mutation createProjectInformationMutation(
    $input: CreateProjectInformationInput!
  ) {
    createProjectInformation(input: $input) {
      projectInformationData {
        id
        jsonData
        rowId
      }
    }
  }
`;

const useCreateProjectInformationMutation = () =>
  useMutationWithErrorMessage<createProjectInformationMutation>(
    mutation,
    () => 'An error occured while attempting to create the project information'
  );

export { mutation, useCreateProjectInformationMutation };
