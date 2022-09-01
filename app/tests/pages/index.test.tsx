import { withRelayOptions } from '../../pages';
import { screen } from '@testing-library/react';
import PageTestingHelper from '../utils/pageTestingHelper';
import Home from '../../pages/index';
import compiledPagesQuery, {
  pagesQuery,
} from '__generated__/pagesQuery.graphql';

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
    const ctx = {
      req: {
        url: '/',
      },
    } as any;

    expect(await withRelayOptions.serverSideProps(ctx)).toEqual({});
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
});
