import { withRelayOptions } from '../../pages/dashboard';
import { screen } from '@testing-library/react';
import Dashboard from '../../pages/dashboard';
import PageTestingHelper from '../utils/pageTestingHelper';
import compileddashboardQuery, {
  dashboardQuery,
} from '../../__generated__/dashboardQuery.graphql';

const mockQueryPayload = {
  Query() {
    return {
      allApplications: {
        nodes: [
          {
            id: 'WyJhcHBsaWNhdGlvbnMiLDJd',
            rowId: 2,
            owner: '4e0ac88c-bf05-49ac-948f-7fd53c7a9fd6',
            status: 'withdrawn',
            projectName: null,
            ccbcNumber: 'CCBC-010001',
            lastEditedPage: '',
            intakeByIntakeId: {
              ccbcIntakeNumber: 1,
              closeTimestamp: '2022-09-09T13:49:23.513427-07:00',
              openTimestamp: '2022-07-25T00:00:00-07:00',
            },
          },
        ],
      },
      session: {
        sub: '4e0ac88c-bf05-49ac-948f-7fd53c7a9fd6',
      },
      openIntake: {
        openTimestamp: '2022-08-19T09:00:00-07:00',
        closeTimestamp: '2027-08-19T09:00:00-07:00',
      },
    };
  },
};

const mockClosedIntakePayload = {
  Query() {
    return {
      allApplications: { nodes: [] },
      session: {
        sub: '4e0ac88c-bf05-49ac-948f-7fd53c7a9fd6',
      },
      openIntake: null,
    };
  },
};

const pageTestingHelper = new PageTestingHelper<dashboardQuery>({
  pageComponent: Dashboard,
  compiledQuery: compileddashboardQuery,
  defaultQueryResolver: mockQueryPayload,
  defaultQueryVariables: {
    formOwner: { owner: '4e0ac88c-bf05-49ac-948f-7fd53c7a9fd6' },
  },
});

describe('The index page', () => {
  beforeEach(() => {
    pageTestingHelper.reinit();
  });

  it('displays the correct nav links when user is logged in', () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(screen.getByText('Logout')).toBeInTheDocument();
    expect(screen.getByTestId('dashboard-btn-test')).toBeInTheDocument();
  });

  it('should redirect an unauthorized user', async () => {
    const ctx = {
      req: {
        url: '/dashboard',
      },
    } as any;

    expect(await withRelayOptions.serverSideProps(ctx)).toEqual({
      redirect: {
        destination: '/',
      },
    });
  });

  it('renders the close date', () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(
      screen.getByText(/August 19, 2027, 9:00:00 a.m. PDT/)
    ).toBeInTheDocument();
  });

  it('does not display alert message when there is an open intake', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(
      screen.queryByText(
        `New applications will be accepted after updates to ISED‘s Eligibility Mapping tool are released.`
      )
    ).toBeNull();
  });

  it('displays the alert message when there is no open intake', async () => {
    pageTestingHelper.loadQuery(mockClosedIntakePayload);
    pageTestingHelper.renderPage();

    expect(
      screen.getByText(
        `New applications will be accepted after updates to ISED‘s Eligibility Mapping tool are released.`
      )
    ).toBeInTheDocument();
  });

  it('has create intake button enabled when there is an open intake', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(
      screen.getByText(`Create application`).closest('button').disabled
    ).toBeFalse();
  });

  it('has create intake button disabled when there is no open intake', async () => {
    pageTestingHelper.loadQuery(mockClosedIntakePayload);
    pageTestingHelper.renderPage();

    expect(screen.getByText(`Create application`)).toBeDisabled();
  });
});
