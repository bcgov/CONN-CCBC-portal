import { screen } from '@testing-library/react';
import compiledPagesQuery, {
  pagesQuery,
} from '__generated__/pagesQuery.graphql';
import Home, { withRelayOptions } from '../../pages';
import PageTestingHelper from '../utils/pageTestingHelper';

const mockQueryPayload = {
  Query() {
    return {
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
      session: {
        sub: '4e0ac88c-bf05-49ac-948f-7fd53c7a9fd6',
      },
      openIntake: null,
    };
  },
};

const loggedOutPayload = {
  Query() {
    return {
      session: {
        sub: null,
      },
      openIntake: null,
    };
  },
};

const intakeAlertMessage =
  'New applications will be accepted after updates to ISED‘s Eligibility Mapping tool are released.';

const closedIntakeCallout = 'Applications are not currently being accepted.';

// using a regex below because the text is broken in multiple elements
const openedIntakeCallout =
  /Applications are accepted until August 19, 2027 at 9:00 a.m. PDT./;

const pageTestingHelper = new PageTestingHelper<pagesQuery>({
  pageComponent: Home,
  compiledQuery: compiledPagesQuery,
  defaultQueryResolver: mockQueryPayload,
});

describe('The index page', () => {
  beforeEach(() => {
    pageTestingHelper.reinit();
  });

  it('does not redirect an unauthorized user', async () => {
    expect(await withRelayOptions.serverSideProps()).toEqual({});
  });

  it('Displays the Go to dashboard button for a logged in user', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(screen.getByText('Go to dashboard')).toBeInTheDocument();
  });

  it('Displays the alert message when there is no open intake', async () => {
    pageTestingHelper.loadQuery(mockClosedIntakePayload);
    pageTestingHelper.renderPage();

    expect(screen.getByTestId("custom-alert")).toBeInTheDocument; 
  });

  it('Displays the alert message when there is an open intake', () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(screen.getByTestId("custom-alert")).toBeInTheDocument; 
  });

  it('Displays the Business BCeID login button', () => {
    pageTestingHelper.loadQuery(loggedOutPayload);
    pageTestingHelper.renderPage();
    const button = screen.getByRole('button', {
      name: 'Login with Business BCeID',
    });
    expect(button.closest('form')).toHaveAttribute(
      'action',
      '/login?kc_idp_hint=bceidbusiness'
    );
  });

  it('Displays the Basic BCeID login button', () => {
    pageTestingHelper.loadQuery(loggedOutPayload);
    pageTestingHelper.renderPage();
    const button = screen.getByRole('button', {
      name: 'Login with Basic BCeID',
    });
    expect(button.closest('form')).toHaveAttribute(
      'action',
      '/login?kc_idp_hint=bceidbasic'
    );
  });
});
