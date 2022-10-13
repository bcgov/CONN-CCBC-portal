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

  it('Does not display alert message when there is an open intake', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(screen.queryByText(intakeAlertMessage)).toBeNull();
  });

  it('Displays the alert message when there is no open intake', async () => {
    pageTestingHelper.loadQuery(mockClosedIntakePayload);
    pageTestingHelper.renderPage();

    expect(screen.getByText(intakeAlertMessage)).toBeInTheDocument();
  });

  it('Displays the opened intake callout when there is an open intake', () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(screen.getByText(openedIntakeCallout)).toBeInTheDocument();
    expect(screen.queryByText(closedIntakeCallout)).toBeNull();
  });
  it('Displays the closed intake callout when there is no open intake', () => {
    pageTestingHelper.loadQuery(mockClosedIntakePayload);
    pageTestingHelper.renderPage();

    expect(screen.getByText(closedIntakeCallout)).toBeInTheDocument();
    expect(screen.queryByText(openedIntakeCallout)).toBeNull();
  });
});
