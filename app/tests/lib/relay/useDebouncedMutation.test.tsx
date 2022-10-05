import useDebouncedMutation from 'schema/mutations/useDebouncedMutation';
import { graphql } from 'relay-runtime';
import RelayModernEnvironment from 'relay-runtime/lib/store/RelayModernEnvironment';
import { createMockEnvironment } from 'relay-test-utils';
import { render, act } from '@testing-library/react';
import { useMemo, useState } from 'react';
import { RelayEnvironmentProvider } from 'react-relay';

/**
 * This test setup is based on the test of the useMutation hook in
 * the react-relay library.
 */
let environment: RelayModernEnvironment;
let isInFlightFn;
let renderContainer;
let testMutation;
let commit;
let disposable;

const variables = {
  input: {
    id: 'relayId',
    newFormData: { name: 'test' },
  },
};

describe('the useDebouncedMutation hook', () => {
  beforeEach(() => {
    environment = createMockEnvironment();
    isInFlightFn = jest.fn();
    testMutation = graphql`
      mutation useDebouncedMutationTestMutation(
        $input: UpdateApplicationInput!
      ) {
        updateApplication(input: $input) {
          application {
            id
            formData {
              formData
            }
          }
        }
      }
    `;

    function Renderer({ initialMutation, commitInRender }) {
      const [mutation] = useState(initialMutation);
      const [commitFn, isMutationInFlight] = useDebouncedMutation(
        mutation,
        () => 'An error occurred when making a change.'
      );
      commit = (config) =>
        act(() => {
          disposable = commitFn(config);
        });
      if (commitInRender) {
        // `commitInRender` never changes in the test
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useMemo(() => {
          commit({ variables });
        }, []);
      }
      isInFlightFn(isMutationInFlight);
      return null;
    }

    function Container(props) {
      const [env] = useState(props.environment);
      return (
        <RelayEnvironmentProvider environment={env}>
          <Renderer
            initialMutation={props.mutation}
            commitInRender={props.commitInRender}
          />
        </RelayEnvironmentProvider>
      );
    }

    renderContainer = function (env, mutation, commitInRender = false) {
      act(() => {
        render(
          <Container
            environment={env}
            mutation={mutation}
            commitInRender={commitInRender}
          />
        );
      });
    };
  });

  it('disposes the mutation when a new debounced mutation is called with the same debounceKey', () => {
    renderContainer(environment, testMutation);

    commit({ variables, debounceKey: 'debounceKey1' });

    const disposable1 = disposable;
    const disposeSpy = jest.spyOn(disposable1, 'dispose');
    commit({ variables, debounceKey: 'debounceKey1' });
    expect(disposeSpy).toBeCalledTimes(1);
  });

  it('throws an exception if the debounceKey is not provided', () => {
    renderContainer(environment, testMutation);

    expect(() => commit({ variables })).toThrow();
  });
});
