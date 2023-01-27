import { screen } from '@testing-library/react';
import ApplicationIntakes from 'pages/analyst/admin/application-intakes';
import compiledApplicationIntakesQuery, {
  applicationIntakesQuery,
} from '__generated__/applicationIntakesQuery.graphql';
import PageTestingHelper from '../../../utils/pageTestingHelper';
import { checkTabStyles, checkRouteAuthorization } from './shared-admin-tests';

const mockQueryPayload = {
  Query() {
    return {
      session: {
        sub: '4e0ac88c-bf05-49ac-948f-7fd53c7a9fd6',
        authRole: 'ccbc_admin',
      },
    };
  },
};

jest.mock('@bcgov-cas/sso-express/dist/helpers');

const pageTestingHelper = new PageTestingHelper<applicationIntakesQuery>({
  pageComponent: ApplicationIntakes,
  compiledQuery: compiledApplicationIntakesQuery,
  defaultQueryResolver: mockQueryPayload,
  defaultQueryVariables: {},
});

describe('The Application intakes admin page', () => {
  beforeEach(() => {
    pageTestingHelper.reinit();
    pageTestingHelper.setMockRouterValues({
      pathname: '/analyst/admin/application-intakes',
    });
  });

  // Shared admin dashboard pages route authorization tests
  checkRouteAuthorization();

  it('highlights the correct nav tabs', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const tabName = 'Application intakes';

    // Shared admin dashboard pages tab styles test
    checkTabStyles(tabName);

    expect(
      screen.getByRole('link', {
        name: tabName,
      })
    ).toBeVisible();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
