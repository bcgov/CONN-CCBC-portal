import { graphql } from 'react-relay';
import type { createApplicationPackageMutation } from '__generated__/createApplicationPackageMutation.graphql';

import useMutationWithErrorMessage from '../useMutationWithErrorMessage';

const mutation = graphql`
  mutation createApplicationPackageMutation(
    $input: CreateApplicationPackageInput!
  ) {
    createApplicationPackage(input: $input) {
      applicationPackage {
        package
      }
    }
  }
`;

const useApplicationPackageMutation = () =>
  useMutationWithErrorMessage<createApplicationPackageMutation>(
    mutation,
    () => 'An error occurred while attempting to create application package.'
  );

export { mutation, useApplicationPackageMutation };
