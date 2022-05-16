import { relayEnvironment } from '../../lib/relay';

import { commitMutation, graphql } from 'react-relay';
const mutation = graphql`
  mutation createApplicationMutation($input: CreateApplicationInput!) {
    createApplication(input: $input) {
      clientMutationId
    }
  }
`;

const createApplicationMutation = (owner: string) => {
  const variables = {
    input: {
      application: {
        owner: owner,
      },
    },
  };

  commitMutation(relayEnvironment, {
    mutation,
    variables,
    onError: () => {
      return console.log('CreateApplicationMutation failed');
    },
    onCompleted: (response) => {
      console.log(response);
    },
  });
};

export default createApplicationMutation;
