import { mocked } from 'jest-mock';
import withRelayOptions from 'lib/relay/withRelayOptions';
import { isAuthenticated } from '@bcgov-cas/sso-express/dist/helpers';

jest.mock('@bcgov-cas/sso-express/dist/helpers');

describe('The index page', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should not redirect for non protected pages', async () => {
    const ctx = {
      req: {
        url: '/applicantportal',
      },
    } as any;

    expect(await withRelayOptions.serverSideProps(ctx)).toEqual({});
  });

  it('should not redirect if the user is authorized', async () => {
    mocked(isAuthenticated).mockReturnValue(true);

    const ctx = {
      req: {
        url: '/analystportal/dashboard',
        claims: {
          client_roles: ['admin'],
          identity_provider: 'idir',
        },
      },
    } as any;

    expect(await withRelayOptions.serverSideProps(ctx)).toEqual({});
  });

  it('should redirect authenticated users to their landing page if they are not authorized', async () => {
    mocked(isAuthenticated).mockReturnValue(true);

    const ctx = {
      req: {
        url: '/analystportal/dashboard',
        claims: {
          identity_provider: 'bceidbasic',
        },
      },
    } as any;

    expect(await withRelayOptions.serverSideProps(ctx)).toEqual({
      redirect: {
        destination: '/applicantportal/dashboard',
      },
    });
  });

  it('should redirect unauthenticated users to the appropriate landing page', async () => {
    const ctxAnalyst = {
      req: {
        url: '/analystportal/dashboard',
      },
    } as any;

    const ctxApplicant = {
      req: {
        url: '/applicantportal/dashboard',
      },
    } as any;

    expect(await withRelayOptions.serverSideProps(ctxAnalyst)).toEqual({
      redirect: {
        destination: '/analystportal',
      },
    });

    expect(await withRelayOptions.serverSideProps(ctxApplicant)).toEqual({
      redirect: {
        destination: '/applicantportal',
      },
    });
  });
});
