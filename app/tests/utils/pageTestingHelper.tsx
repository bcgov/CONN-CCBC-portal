import { render } from '@testing-library/react';
import { MockPayloadGenerator } from 'relay-test-utils';
import {
  loadQuery,
  PreloadedQuery,
  RelayEnvironmentProvider,
} from 'react-relay';
import { RelayProps } from 'relay-nextjs';
import { ConcreteRequest, OperationType } from 'relay-runtime';
import { MockResolvers } from 'relay-test-utils/lib/RelayMockPayloadGenerator';
import GlobalTheme from 'styles/GlobalTheme';
import { RouterContext } from 'next/dist/shared/lib/router-context.shared-runtime';
import { AppProvider } from 'components/AppProvider';
import UnsavedChangesProvider from 'components/UnsavedChangesProvider';
import { GrowthBookProvider } from '@growthbook/growthbook-react';
import TestingHelper from './TestingHelper';
import mockGrowthBook from './mockGrowthBook';

interface PageTestingHelperOptions<TQuery extends OperationType> {
  pageComponent: (props: RelayProps<{}, TQuery>) => JSX.Element;
  compiledQuery: ConcreteRequest;
  defaultQueryResolver?: MockResolvers;
  defaultQueryVariables?: TQuery['variables'];
}

class PageTestingHelper<TQuery extends OperationType> extends TestingHelper {
  private options: PageTestingHelperOptions<TQuery>;

  constructor(options: PageTestingHelperOptions<TQuery>) {
    super();
    this.options = {
      defaultQueryResolver: {},
      defaultQueryVariables: {},
      ...options,
    };

    this.reinit();
  }

  public reinit() {
    super.reinit();

    this.initialQueryRef = null;
  }

  private initialQueryRef: PreloadedQuery<TQuery>;

  public loadQuery(queryResolver?: MockResolvers) {
    this.environment.mock.queueOperationResolver((operation) => {
      return MockPayloadGenerator.generate(
        operation,
        queryResolver ?? this.options.defaultQueryResolver
      );
    });

    this.environment.mock.queuePendingOperation(
      this.options.compiledQuery,
      this.options.defaultQueryVariables
    );

    this.initialQueryRef = loadQuery<TQuery>(
      this.environment,
      this.options.compiledQuery,
      this.options.defaultQueryVariables
    );
  }

  public renderPage() {
    return render(
      <GrowthBookProvider growthbook={mockGrowthBook as any}>
        <GlobalTheme>
          <RouterContext.Provider value={this.router}>
            <RelayEnvironmentProvider environment={this.environment}>
              <AppProvider>
                <UnsavedChangesProvider>
                  <this.options.pageComponent
                    CSN
                    preloadedQuery={this.initialQueryRef}
                  />
                </UnsavedChangesProvider>
              </AppProvider>
            </RelayEnvironmentProvider>
          </RouterContext.Provider>
        </GlobalTheme>
      </GrowthBookProvider>
    );
  }
}

export default PageTestingHelper;
