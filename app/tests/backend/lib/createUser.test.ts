/**
 * @jest-environment node
 */
import { mocked } from 'jest-mock';
import createUser from 'backend/lib/createUser';
import { performQuery } from 'backend/lib/graphql';
import getAuthRole from 'utils/getAuthRole';

jest.mock('backend/lib/graphql');

describe('the createUser function', () => {
  it("doesn't call performQuery with unauthorized IDIR users", async () => {
    const req = {
      claims: {
        identity_provider: 'idir',
      },
      session: { tokenSet: {} },
    };

    // ensure that our request is well defined for the scenario
    expect(getAuthRole(req as any).landingRoute).toBe(
      '/analyst/request-access'
    );

    await createUser()(req as any);
    expect(mocked(performQuery)).not.toHaveBeenCalled();
  });

  it('calls performQuery with authorized IDIR users', async () => {
    const req = {
      claims: {
        identity_provider: 'idir',
        client_roles: ['analyst'],
      },
      session: { tokenSet: {} },
    };

    mocked(performQuery).mockResolvedValue({});

    await createUser()(req as any);
    expect(mocked(performQuery)).toHaveBeenCalled();
  });

  it('throws an exception if performQuery returns errors', async () => {
    const req = {
      claims: {
        identity_provider: 'idir',
        client_roles: ['analyst'],
      },
      session: { tokenSet: {} },
    };

    mocked(performQuery).mockResolvedValue({
      errors: ['some error'],
    } as any);

    // regex: s == single line: dot matches new lines
    await expect(createUser()(req as any)).rejects.toThrow(
      /^Failed to create user from session:.*some error/s
    );

    expect(mocked(performQuery)).toHaveBeenCalled();
  });
});
