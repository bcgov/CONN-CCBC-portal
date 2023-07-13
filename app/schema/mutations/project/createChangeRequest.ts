import { graphql } from 'react-relay';
import { createChangeRequestMutation } from '__generated__/createChangeRequestMutation.graphql';
import useMutationWithErrorMessage from '../useMutationWithErrorMessage';

const mutation = graphql`
  mutation createChangeRequestMutation(
    $connections: [ID!]!
    $input: CreateChangeRequestInput!
  ) {
    createChangeRequest(input: $input) {
      changeRequestDataEdge @appendEdge(connections: $connections) {
        cursor
        node {
          id
          amendmentNumber
          createdAt
          updatedAt
          jsonData
          rowId
        }
      }
    }
  }
`;

const useCreateChangeRequestMutation = () =>
  useMutationWithErrorMessage<createChangeRequestMutation>(
    mutation,
    () => 'An error occured while attempting to create the conditional approval'
  );

export { mutation, useCreateChangeRequestMutation };
