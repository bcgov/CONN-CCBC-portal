import { act, fireEvent, screen } from '@testing-library/react';
import FeatureFlags from 'pages/analyst/admin/feature-flags';
import compiledFeatureFlagsQuery, {
  featureFlagsQuery,
} from '__generated__/featureFlagsQuery.graphql';
import PageTestingHelper from '../../../utils/pageTestingHelper';
import { checkTabStyles, checkRouteAuthorization } from './shared-admin-tests';

const mockQueryPayload = {
  Query() {
    return {
      session: {
        sub: '4e0ac88c-bf05-49ac-948f-7fd53c7a9fd6',
        authRole: 'ccbc_admin',
      },
      allFeatureFlags: {
        edges: [
          {
            node: {
              id: 'WyJmZWF0dXJlRmxhZ3MiLDFd',
              flagKey: 'show_lead',
              isEnabled: false,
              value: null,
              description: 'Whether the lead application column is shown',
            },
          },
        ],
      },
    };
  },
};

jest.mock('@bcgov-cas/sso-express/dist/helpers');

const pageTestingHelper = new PageTestingHelper<featureFlagsQuery>({
  pageComponent: FeatureFlags,
  compiledQuery: compiledFeatureFlagsQuery,
  defaultQueryResolver: mockQueryPayload,
  defaultQueryVariables: {},
});

describe('The Feature flags admin page', () => {
  beforeEach(() => {
    pageTestingHelper.reinit();
    pageTestingHelper.setMockRouterValues({
      pathname: '/analyst/admin/feature-flags',
    });
  });

  // Shared admin dashboard pages route authorization tests
  checkRouteAuthorization();

  it('highlights the correct nav tabs', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const tabName = 'Feature Flags';

    // Shared admin dashboard pages tab styles test
    checkTabStyles(tabName);

    expect(
      screen.getByRole('link', {
        name: tabName,
      })
    ).toBeVisible();
  });

  it('displays the feature flags page heading', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(
      screen.getByRole('heading', { name: 'Feature Flags' })
    ).toBeVisible();
  });

  it('displays the existing feature flags', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(screen.getByText('show_lead')).toBeInTheDocument();
  });

  it('calls the mutation when a flag is added', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const addFlagButton = screen.getByText('Add flag');
    expect(addFlagButton).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(addFlagButton);
    });

    const flagKey = screen.getByLabelText('Flag key *');
    const description = screen.getByLabelText('Description');

    await act(async () => {
      fireEvent.change(flagKey, { target: { value: 'new_flag' } });
    });

    await act(async () => {
      fireEvent.change(description, {
        target: { value: 'A new test flag' },
      });
    });

    const addBtn = screen.getByRole('button', { name: 'Add' });

    await act(async () => {
      fireEvent.click(addBtn);
    });

    pageTestingHelper.expectMutationToBeCalled('createFeatureFlagMutation', {
      connections: [
        'client:root:__FeatureFlags_allFeatureFlags_connection(condition:{"archivedAt":null},orderBy:"FLAG_KEY_ASC")',
      ],
      input: {
        featureFlag: {
          flagKey: 'new_flag',
          isEnabled: false,
          value: null,
          description: 'A new test flag',
        },
      },
    });
  });

  it('asks for confirmation before archiving a flag, and cancel keeps it', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const deleteButton = screen.getByLabelText('Delete show_lead');

    await act(async () => {
      fireEvent.click(deleteButton);
    });

    expect(
      screen.getByRole('heading', { name: 'Delete flag' })
    ).toBeInTheDocument();

    const cancelButton = screen.getByTestId('delete-feature-flag-cancel-btn');

    await act(async () => {
      fireEvent.click(cancelButton);
    });

    expect(
      pageTestingHelper.environment.mock
        .getAllOperations()
        .some(
          ({ fragment: { node } }) => node.name === 'updateFeatureFlagMutation'
        )
    ).toBe(false);
  });

  it('calls the mutation to archive a flag when delete is confirmed', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const deleteButton = screen.getByLabelText('Delete show_lead');

    await act(async () => {
      fireEvent.click(deleteButton);
    });

    const confirmButton = screen.getByTestId('delete-feature-flag-yes-btn');

    await act(async () => {
      fireEvent.click(confirmButton);
    });

    pageTestingHelper.expectMutationToBeCalled('updateFeatureFlagMutation', {
      input: {
        id: 'WyJmZWF0dXJlRmxhZ3MiLDFd',
        featureFlagPatch: {
          archivedAt: expect.any(String),
        },
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
