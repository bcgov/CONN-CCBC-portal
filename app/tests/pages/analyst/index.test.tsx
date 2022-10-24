import { screen } from '@testing-library/react';
import { isAuthenticated } from '@bcgov-cas/sso-express/dist/helpers';
import { mocked } from 'jest-mock';
import compiledPagesQuery, {
  analystQuery,
} from '__generated__/analystQuery.graphql';
import Home, { withRelayOptions } from '../../../pages/analyst';
import PageTestingHelper from '../../utils/pageTestingHelper';

const mockQueryPayload = {
  Query() {
    return {
      session: {},
    };
  },
};

jest.mock('@bcgov-cas/sso-express/dist/helpers');

const pageTestingHelper = new PageTestingHelper<analystQuery>({
  pageComponent: Home,
  compiledQuery: compiledPagesQuery,
  defaultQueryResolver: mockQueryPayload,
});

describe('The index page', () => {
  beforeEach(() => {
    pageTestingHelper.reinit();
  });

  it('displays the title', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(screen.getByText(`CCBC Analyst login`)).toBeVisible();
  });

  it('should not redirect an unauthorized user', async () => {
    const ctx = {
      req: {
        url: '/analyst',
      },
    } as any;

    expect(await withRelayOptions.serverSideProps(ctx)).toEqual({});
  });

  it('should redirect a user logged in with IDIR but not assigned a role', async () => {
    mocked(isAuthenticated).mockReturnValue(true);

    const ctx = {
      req: {
        url: '/analyst',
        claims: {
          client_roles: [],
          identity_provider: 'idir',
        },
      },
    } as any;

    expect(await withRelayOptions.serverSideProps(ctx)).toEqual({
      redirect: {
        destination: '/analyst/request-access',
      },
    });
  });

  it('should redirect a user logged in with IDIR and an assigned role', async () => {
    mocked(isAuthenticated).mockReturnValue(true);

    const ctx = {
      req: {
        url: '/analyst',
        claims: {
          client_roles: ['admin'],
          identity_provider: 'idir',
        },
      },
    } as any;

    expect(await withRelayOptions.serverSideProps(ctx)).toEqual({
      redirect: {
        destination: '/analyst/dashboard',
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
