import { NextRouter } from 'next/router';
import { createMockEnvironment, RelayMockEnvironment } from 'relay-test-utils';
import { createMockRouter } from './mockNextRouter';

class TestingHelper {
  public environment: RelayMockEnvironment;

  public router: NextRouter;

  public reinit() {
    this.environment = createMockEnvironment();

    this.router = createMockRouter();
  }

  public setMockRouterValues(routerValues: Partial<NextRouter>) {
    this.router = createMockRouter(routerValues);
  }

  public expectMutationToBeCalled(mutationName: string, variables?: any) {
    try {
      expect(this.environment.mock.getAllOperations()).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            fragment: expect.objectContaining({
              node: expect.objectContaining({
                type: 'Mutation',
                name: mutationName,
              }),
            }),
            request: expect.objectContaining({
              variables,
            }),
          }),
        ])
      );
    } catch (e) {
      const allOperations = this.environment.mock.getAllOperations();
      const mutationsWithExpectedName = allOperations.filter(
        ({ fragment: { node } }) => {
          return node.type === 'Mutation' && node.name === mutationName;
        }
      );

      if (mutationsWithExpectedName.length === 0) {
        const allMutationNames = allOperations.map(
          ({ fragment: { node } }) => node.name
        );
        e.message = `Expected to find a mutation with name "${mutationName}" but found the following mutation names: ${allMutationNames.join(
          ', '
        )}`;
        throw e;
      }

      const actualMutationVariables = mutationsWithExpectedName
        .map(({ request: { variables } }) => JSON.stringify(variables, null, 2))
        .join('\n\n');

      e.message =
        `Expected variables for mutation "${mutationName}":\n` +
        JSON.stringify(variables, null, 2) +
        `\nActual variables for mutation "${mutationName}":\n` +
        actualMutationVariables;

      throw e;
    }
  }
}

export default TestingHelper;
