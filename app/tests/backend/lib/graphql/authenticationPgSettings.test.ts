/**
 * @jest-environment node
 */
import { mocked } from 'jest-mock';
import authenticationPgSettings from '../../../../backend/lib/graphql/authenticationPgSettings';
import config from '../../../../config';

jest.mock('../../../../config');

describe('the authenticationPgSettings function', () => {
  it('returns the JWT claims and roles from the request', () => {
    mocked(config.get).mockImplementation((name: any) => {
      const mockConfig = { ENABLE_MOCK_AUTH: false };
      return mockConfig[name] as any;
    });

    const req = {
      session: { tokenSet: {} },
      claims: {
        email: 'admin@example.com',
        sub: 'exampleAdmin@idir',
        identity_provider: 'idir',
        client_roles: ['admin'],
      },
    } as any;

    const pgSettings = authenticationPgSettings(req);
    expect(pgSettings['jwt.claims.sub']).toBe('exampleAdmin@idir');
    expect(pgSettings['jwt.claims.email']).toBe('admin@example.com');

    expect(pgSettings.role).toBe('ccbc_admin');
  });

  it('returns the mocked role and sub when ENABLE_MOCK_AUTH is true', () => {
    mocked(config.get).mockImplementation((name: any) => {
      const mockConfig = {
        ENABLE_MOCK_AUTH: true,
        MOCK_ROLE_COOKIE_NAME: 'mocks.auth_role',
      };
      return mockConfig[name] as any;
    });

    const req = {
      cookies: { 'mocks.auth_role': 'ccbc_admin' },
    } as any;

    const pgSettings = authenticationPgSettings(req);
    expect(pgSettings['jwt.claims.sub']).toBe('mockUser@ccbc_admin');
    expect(pgSettings['jwt.claims.email']).toBeUndefined();

    expect(pgSettings.role).toBe('ccbc_admin');
  });
});
