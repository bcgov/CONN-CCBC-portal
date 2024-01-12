import { graphql } from 'react-relay';
import type { createProjectTypeMutation } from '__generated__/createProjectTypeMutation.graphql';

import useMutationWithErrorMessage from '../useMutationWithErrorMessage';

const mutation = graphql`
  mutation createProjectTypeMutation($input: CreateProjectTypeInput!) {
    createProjectType(input: $input) {
      applicationProjectType {
        projectType
      }
    }
  }
`;

const useCreateProjectTypeMutation = () =>
  useMutationWithErrorMessage<createProjectTypeMutation>(
    mutation,
    () => 'An error occurred while attempting to create application package.'
  );

export { mutation, useCreateProjectTypeMutation };
