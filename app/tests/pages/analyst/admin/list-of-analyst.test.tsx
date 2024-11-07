import { act, fireEvent, screen } from '@testing-library/react';
import ListOfAnalysts from 'pages/analyst/admin/list-of-analysts';
import compiledListOfAnalystsQuery, {
  listOfAnalystsQuery,
} from '__generated__/listOfAnalystsQuery.graphql';
import PageTestingHelper from '../../../utils/pageTestingHelper';
import { checkTabStyles, checkRouteAuthorization } from './shared-admin-tests';

const mockQueryPayload = {
  Query() {
    return {
      session: {
        sub: '4e0ac88c-bf05-49ac-948f-7fd53c7a9fd6',
        authRole: 'ccbc_admin',
      },
      allAnalysts: {
        edges: [
          {
            node: {
              givenName: 'test',
              familyName: '1',
              email: 'test1@mail.com',
              active: true,
              id: 'WyJhbmFseXN0cyIsMjRd',
            },
          },
          {
            node: {
              givenName: 'test',
              familyName: '2',
              email: 'test2@mail.com',
              active: true,
              id: 'WyJhbmFseXN0cyIsOV0=',
            },
          },
        ],
      },
    };
  },
};

jest.mock('@bcgov-cas/sso-express/dist/helpers');

const pageTestingHelper = new PageTestingHelper<listOfAnalystsQuery>({
  pageComponent: ListOfAnalysts,
  compiledQuery: compiledListOfAnalystsQuery,
  defaultQueryResolver: mockQueryPayload,
  defaultQueryVariables: {},
});

describe('The Download attachments admin page', () => {
  beforeEach(() => {
    pageTestingHelper.reinit();
    pageTestingHelper.setMockRouterValues({
      pathname: '/analyst/admin/list-of-analysts',
    });
  });

  // Shared admin dashboard pages route authorization tests
  checkRouteAuthorization();

  it('highlights the correct nav tabs', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const tabName = 'List of analysts';

    // Shared admin dashboard pages tab styles test
    checkTabStyles(tabName);

    expect(
      screen.getByRole('link', {
        name: tabName,
      })
    ).toBeVisible();
  });

  it('displays the list of analysts', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(screen.getByText('test 1')).toBeVisible();
    expect(screen.getByText('test 2')).toBeVisible();
  });

  it('calls the mutation when an analyst is added', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const addAnalyst = screen.getByText('Add analyst');
    expect(addAnalyst).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(addAnalyst);
    });

    const givenName = screen.getByTestId('root_givenName');
    const familyName = screen.getByTestId('root_familyName');
    const email = screen.getByTestId('root_email');

    expect(givenName).toBeInTheDocument();
    expect(familyName).toBeInTheDocument();

    await act(async () => {
      fireEvent.change(givenName, { target: { value: 'test' } });
    });

    await act(async () => {
      fireEvent.change(familyName, { target: { value: 'test' } });
    });

    await act(async () => {
      fireEvent.change(email, { target: { value: 'test@mail.com' } });
    });

    const addBtn = screen.getByRole('button', { name: 'Add' });

    await act(async () => {
      fireEvent.click(addBtn);
    });

    pageTestingHelper.expectMutationToBeCalled('createAnalystMutation', {
      connections: [
        'client:root:__ListOfAnalysts_allAnalysts_connection(orderBy:"GIVEN_NAME_ASC")',
      ],
      input: {
        analyst: {
          givenName: 'test',
          familyName: 'test',
          email: 'test@mail.com',
        },
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
