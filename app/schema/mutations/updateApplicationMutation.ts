import { relayEnvironment } from '../../lib/relay';
import { commitMutation, graphql } from 'react-relay';

const mutation = graphql`
  mutation updateApplicationMutation($input: UpdateApplicationByOwnerInput!) {
    updateApplicationByOwner(input: $input) {
      clientMutationId
      application {
        formData
        id
        owner
        status
        referenceNumber
      }
    }
  }
`;

const updateApplicationMutation = async (input: {
  formData: string;
  owner: string;
  status: string;
}) => {
  const variables = {
    input: {
      applicationPatch: {
        formData: input.formData,
        status: input.status,
      },
      owner: input.owner,
    },
  };
  let response;

  commitMutation(relayEnvironment, {
    mutation,
    variables,
    onError: () => {
      return console.log('updateApplicationMutation failed');
    },
    onCompleted: (response: any) => {
      const formData = response.updateApplicationByOwner.application;
      return formData;
    },
  });
};

export default updateApplicationMutation;
