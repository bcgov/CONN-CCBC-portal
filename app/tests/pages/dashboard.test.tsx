import { screen } from '@testing-library/react';
import Dashboard, { withRelayOptions } from '../../pages/dashboard';
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
            formData: {
              lastEditedPage: '',
              isEditable: false,
            },
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

const mockNoApplicationsPayload = {
  Query() {
    return {
      allApplications: { nodes: [] },
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

  it('displays the open intake message when there an open intake', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(
      screen.getByText(/Review of applications will begin on/)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/August 19, 2027, 9:00:00 a.m. PDT/)
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        /You can edit draft and submitted applications until this date./
      )
    ).toBeInTheDocument();
  });

  it('displays the closed intake message when there is no open intake', async () => {
    pageTestingHelper.loadQuery(mockClosedIntakePayload);
    pageTestingHelper.renderPage();

    expect(
      screen.getByText(`Applications are currently not being accepted.`)
    ).toBeInTheDocument();

    const link = screen.getByText('program webpage');
    expect(link).toHaveAttribute(
      'href',
      'https://www2.gov.bc.ca/gov/content/governments/connectivity-in-bc/20601/20601-63737'
    );
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

  it('displays the message when user has no applications', async () => {
    pageTestingHelper.loadQuery(mockNoApplicationsPayload);
    pageTestingHelper.renderPage();

    expect(
      screen.getByText(`Applications will appear here`)
    ).toBeInTheDocument();
  });

  it('displays the dashboard table when the user has an application', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(screen.getByText(`CCBC ID`)).toBeInTheDocument();
    expect(screen.getByText(`Project title`)).toBeInTheDocument();
    expect(screen.getByText(`Status`)).toBeInTheDocument();
    expect(screen.getByText(`Actions`)).toBeInTheDocument();
    expect(screen.getByText(`CCBC-010001`)).toBeInTheDocument();
    expect(screen.getByText(`withdrawn`)).toBeInTheDocument();
    expect(screen.getByText(`View`)).toBeInTheDocument();
  });
});
