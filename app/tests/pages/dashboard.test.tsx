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
            referenceNumber: 1,
            status: 'withdrawn',
            projectName: null,
            ccbcId: 'CCBC-010001',
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
        closeTimestamp: '2022-08-27T12:51:26.69172-04:00',
      },
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

it('displays the correct nav links when user is logged in', () => {
  pageTestingHelper.loadQuery();
  pageTestingHelper.renderPage();

  expect(screen.getByText('Logout')).toBeInTheDocument();
  expect(screen.getByTestId('dashboard-btn-test')).toBeInTheDocument();
});

describe('The index page', () => {
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

  
  it('Renders the close date', () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(screen.getByText(/August 27, 2022, 9:51 a.m. PDT/)).toBeInTheDocument();
  });
});
