import { graphql } from 'react-relay';
import { createAnalystMutation } from '__generated__/createAnalystMutation.graphql';
import useMutationWithErrorMessage from '../useMutationWithErrorMessage';

const mutation = graphql`
  mutation createAnalystMutation(
    $connections: [ID!]!
    $input: CreateAnalystInput!
  ) {
    createAnalyst(input: $input) {
      analystEdge @appendEdge(connections: $connections) {
        cursor
        node {
          id
          givenName
          familyName
          active
        }
      }
    }
  }
`;

const useCreateAnalystMutation = () =>
  useMutationWithErrorMessage<createAnalystMutation>(
    mutation,
    () => 'An error occured while attempting to create the screening assessment'
  );

export { mutation, useCreateAnalystMutation };
