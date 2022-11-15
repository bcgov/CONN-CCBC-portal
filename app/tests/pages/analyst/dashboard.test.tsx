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
            rowId: 2,
            status: 'received',
            projectName: 'Test Proj Name 2',
            ccbcNumber: 'CCBC-010002',
            organizationName: 'Test Org Name 2',
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

    expect(
      screen.getByText('Dashboard', {
        selector: 'h1',
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
      screen.getAllByRole('option', { name: 'Unassigned' })[0]
    ).toBeInTheDocument();
  });

  it('shows the correct options in the assign lead dropdown', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(
      screen.getAllByRole('option', { name: 'Test 1' })[0]
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole('option', { name: 'Test 2' })[0]
    ).toBeInTheDocument();
  });

  it('calls the mutation when a lead has been selected', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const assignLead = screen.getAllByRole('option', { name: 'Test 2' })[0]
      .parentElement;

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

  afterEach(() => {
    jest.clearAllMocks();
  });
});
