import { graphql } from 'react-relay';
import type { createPackageMutation } from '__generated__/createPackageMutation.graphql';

import useMutationWithErrorMessage from '../useMutationWithErrorMessage';

const mutation = graphql`
  mutation createPackageMutation($input: CreatePackageInput!) {
    createPackage(input: $input) {
      applicationPackage {
        package
      }
    }
  }
`;

const useCreatePackageMutation = () =>
  useMutationWithErrorMessage<createPackageMutation>(
    mutation,
    () => 'An error occurred while attempting to create application package.'
  );

export { mutation, useCreatePackageMutation };
