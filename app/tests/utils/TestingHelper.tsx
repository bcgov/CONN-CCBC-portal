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
  }
}

export default TestingHelper;
