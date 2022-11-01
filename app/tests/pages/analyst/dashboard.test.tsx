import { mocked } from 'jest-mock';
import { screen } from '@testing-library/react';
import { isAuthenticated } from '@bcgov-cas/sso-express/dist/helpers';
import Dashboard from '../../../pages/analyst/dashboard';
import defaultRelayOptions from '../../../lib/relay/withRelayOptions';
import PageTestingHelper from '../../utils/pageTestingHelper';
import compileddashboardQuery, {
  dashboardAnalystQuery,
} from '../../../__generated__/dashboardAnalystQuery.graphql';

const mockQueryPayload = {
  Query() {
    return {
      session: {
        sub: '4e0ac88c-bf05-49ac-948f-7fd53c7a9fd6',
      },
      allApplications: {
        nodes: [
          {
            id: 'someId',
            rowId: 1,
            status: 'received',
            projectName: 'Test Proj Name',
            ccbcNumber: 'CCBC-010001',
            organizationName: 'Test Org Name',
          },
          {
            id: 'someOtherId',
            rowId: 1,
            status: 'received',
            projectName: 'Test Proj Name 2',
            ccbcNumber: 'CCBC-010002',
            organizationName: 'Test Org Name 2',
          },
        ],
      },
    };
  },
};

jest.mock('@bcgov-cas/sso-express/dist/helpers');

const pageTestingHelper = new PageTestingHelper<dashboardAnalystQuery>({
  pageComponent: Dashboard,
  compiledQuery: compileddashboardQuery,
  defaultQueryResolver: mockQueryPayload,
  defaultQueryVariables: {},
});

describe('The index page', () => {
  beforeEach(() => {
    pageTestingHelper.reinit();
  });

  it('should redirect an unauthorized user', async () => {
    const ctx = {
      req: {
        url: '/analyst/dashboard',
      },
    } as any;

    expect(await defaultRelayOptions.serverSideProps(ctx)).toEqual({
      redirect: {
        destination: '/analyst',
      },
    });
  });

  it('should redirect a user logged in with IDIR but not assigned a role', async () => {
    mocked(isAuthenticated).mockReturnValue(true);

    const ctx = {
      req: {
        url: '/analyst/dashboard',
        claims: {
          client_roles: [],
          identity_provider: 'idir',
        },
      },
    } as any;

    expect(await defaultRelayOptions.serverSideProps(ctx)).toEqual({
      redirect: {
        destination: '/analyst/request-access',
      },
    });
  });

  it('should not redirect a user logged in with IDIR and an assigned role', async () => {
    mocked(isAuthenticated).mockReturnValue(true);

    const ctx = {
      req: {
        url: '/analyst/dashboard',
        claims: {
          client_roles: ['admin'],
          identity_provider: 'idir',
        },
      },
    } as any;

    expect(await defaultRelayOptions.serverSideProps(ctx)).toEqual({});
  });

  it('displays the title', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(screen.getByText(`CCBC Analyst dashboard`)).toBeVisible();
  });

  it('displays the Analyst Table', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(screen.getByText('CCBC-010001')).toBeInTheDocument();
    expect(screen.getByText('Test Proj Name')).toBeInTheDocument();
    expect(screen.getByText('Test Org Name')).toBeInTheDocument();

    expect(screen.getByText('CCBC-010002')).toBeInTheDocument();
    expect(screen.getByText('Test Proj Name 2')).toBeInTheDocument();
    expect(screen.getByText('Test Org Name 2')).toBeInTheDocument();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
