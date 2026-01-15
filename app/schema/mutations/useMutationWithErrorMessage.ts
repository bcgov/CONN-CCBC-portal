// import { ErrorContext } from 'contexts/ErrorContext';
// import { useContext } from 'react';
import { Environment, useMutation } from 'react-relay';
import reportClientError from 'lib/helpers/reportClientError';
import {
  commitMutation as baseCommitMutation,
  Disposable,
  GraphQLTaggedNode,
  IEnvironment,
  MutationConfig,
  MutationParameters,
} from 'relay-runtime';

export default function useMutationWithErrorMessage<
  TMutation extends MutationParameters
>(
  mutation: GraphQLTaggedNode,
  getErrorMessage: (relayError: Error) => string,
  commitMutationFn?: (
    environment: Environment,
    config: MutationConfig<TMutation>
  ) => Disposable
) {
  // const { setError } = useContext(ErrorContext);
  const setErrorCommitMutationFn = (
    environment: IEnvironment,
    config: MutationConfig<TMutation>
  ) => {
    const commitConfig: MutationConfig<TMutation> = {
      ...config,
      onError: (error) => {
        config.onError?.(error);
        // setError(getErrorMessage(error));
        reportClientError(error, { source: 'relay-mutation' });
      },
    };

    let disposable;
    if (commitMutationFn) {
      disposable = commitMutationFn(environment, commitConfig);
    } else {
      disposable = baseCommitMutation(environment, commitConfig);
    }

    return disposable;
  };

  return useMutation(mutation, setErrorCommitMutationFn);
}
