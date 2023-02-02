import { mocked } from 'jest-mock';
import userEvent from '@testing-library/user-event';
import { fireEvent, screen } from '@testing-library/react';
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
        authRole: 'ccbc_analyst',
      },
      allApplications: {
        totalCount: 4,
        edges: [
          {
            node: {
              id: '1',
              rowId: 1,
              status: 'received',
              projectName: 'Test Proj Name',
              ccbcNumber: 'CCBC-010001',
              organizationName: 'Test Org Name',
            },
          },
          {
            node: {
              id: '2',
              rowId: 2,
              status: 'approved',
              projectName: 'Test Proj Name 2',
              ccbcNumber: 'CCBC-010002',
              organizationName: 'Test Org Name 2',
            },
          },
          {
            node: {
              id: '3',
              rowId: 3,
              status: 'cancelled',
              projectName: 'Test Proj Name 3',
              ccbcNumber: 'CCBC-010003',
              organizationName: 'Test Org Name 3',
            },
          },
          {
            node: {
              id: '4',
              rowId: 4,
              status: 'assessment',
              projectName: 'Test Proj Name 4',
              ccbcNumber: 'CCBC-010004',
              organizationName: 'Test Org Name 4',
            },
          },
        ],
      },
      allAnalysts: {
        nodes: [
          {
            rowId: 1,
            givenName: 'Test',
            familyName: '1',
          },
          {
            rowId: 2,
            givenName: 'Test',
            familyName: '2',
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
  defaultQueryVariables: {
    offset: null,
    orderBy: null,
    pageSize: null,
  },
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

    expect(
      screen.getByRole('link', {
        name: 'Dashboard',
      })
    ).toBeVisible();
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

  it('analyst table headers are consistent', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(screen.getByText('CCBC ID')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Project title')).toBeInTheDocument();
    expect(screen.getByText('Organization')).toBeInTheDocument();
    expect(screen.getByText('Lead')).toBeInTheDocument();
    expect(screen.getByText('Package')).toBeInTheDocument();
  });

  it('click on table row leads to review page', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const row = screen.getByText('CCBC-010001').parentElement;

    await userEvent.click(row);

    expect(pageTestingHelper.router.push).toHaveBeenCalled();
  });

  it('shows the assign lead dropdown', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(
      screen.getAllByRole('option', { name: 'Unassigned', hidden: true })[0]
    ).toBeInTheDocument();
  });

  it('shows the correct options in the assign lead dropdown', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(
      screen.getAllByRole('option', { name: 'Test 1', hidden: true })[0]
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole('option', { name: 'Test 2', hidden: true })[0]
    ).toBeInTheDocument();
  });

  it('calls the mutation when a lead has been selected', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const assignLead = screen.getAllByRole('option', {
      name: 'Test 2',
      hidden: true,
    })[0].parentElement;

    fireEvent.change(assignLead, { target: { value: 2 } });

    pageTestingHelper.expectMutationToBeCalled(
      'createApplicationAnalystLeadMutation',
      {
        input: {
          applicationAnalystLead: { analystId: 2, applicationId: 1 },
        },
      }
    );
  });

  it('has the correct received status styles', () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const statusName = screen.getByText('Received');

    expect(statusName).toHaveStyle('color: #FFFFFF');
    expect(statusName).toHaveStyle('background-color: #345FA9;');
  });

  it('has the correct approved status styles', () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const statusName = screen.getByText('Approved');

    expect(statusName).toHaveStyle('color: #FFFFFF');
    expect(statusName).toHaveStyle('background-color: #1F8234;');
  });

  it('has the correct cancelled status styles', () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const statusName = screen.getByText('Cancelled');

    expect(statusName).toHaveStyle('color: #414141');
    expect(statusName).toHaveStyle('background-color: #E8E8E8;');
  });

  it('has the correct assessment status styles', () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const statusName = screen.getByText('Assessment');

    expect(statusName).toHaveStyle('color: #003366');
    expect(statusName).toHaveStyle('background-color: #DBE6F0;');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
