import { graphql } from 'react-relay';
import { createIntakeMutation } from '__generated__/createIntakeMutation.graphql';
import useMutationWithErrorMessage from '../useMutationWithErrorMessage';

const mutation = graphql`
  mutation createIntakeMutation(
    $connections: [ID!]!
    $input: CreateIntakeInput!
  ) {
    createIntake(input: $input) {
      intakeEdge @appendEdge(connections: $connections) {
        node
          @prependNode(connections: $connections, edgeTypeName: "IntakesEdge") {
          description
          ccbcIntakeNumber
          closeTimestamp
          openTimestamp
          rollingIntake
          zones
          allowUnlistedFnLedZones
          hiddenCode
          rowId
        }
      }
    }
  }
`;

const useCreateIntakeMutation = () =>
  useMutationWithErrorMessage<createIntakeMutation>(
    mutation,
    () => 'An error occured while attempting to create the intake'
  );

export { mutation, useCreateIntakeMutation };
