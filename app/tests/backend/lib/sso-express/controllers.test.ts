/**
 * @jest-environment node
 */
import type { Request, Response } from 'express';
import { BaseClient, TokenSet, generators } from 'openid-client';
import { createHash } from 'crypto';
import { URL } from 'url';
import {
  authCallbackController,
  loginController,
  logoutController,
  sessionIdleRemainingTimeController,
  tokenSetController,
} from 'backend/lib/sso-express/controllers';
import {
  getSessionRemainingTime,
  isAuthenticated,
} from 'backend/lib/sso-express';
import { SSOExpressOptions } from 'backend/lib/sso-express/types';
import { mocked } from 'jest-mock';

jest.mock('backend/lib/sso-express/helpers');
jest.mock('openid-client');

const oidcIssuer = 'https://example.com/auth/realms/myRealm';
const middlewareOptions: SSOExpressOptions = {
  applicationDomain: '.gov.bc.ca',
  oidcConfig: {
    baseUrl: 'https://example.com',
    clientId: 'myClient',
    oidcIssuer,
  },
  getLandingRoute: jest.fn(),
  getRedirectUri: jest.fn(),
  onAuthCallback: jest.fn(),
};

const client = {
  metadata: {
    post_logout_redirect_uris: ['https://example.com/'],
    redirect_uris: ['https://example.com/auth-callback'],
  },
  endSessionUrl: () => 'https://oidc-endpoint/logout',
  refresh: jest.fn(),
  authorizationUrl: jest.fn(),
  callbackParams: jest.fn(),
  callback: jest.fn(),
} as unknown as BaseClient;

describe('the postLogout controller', () => {
  it('clears the SMSESSION cookie', async () => {
    const res = {
      clearCookie: jest.fn(),
      redirect: jest.fn(),
    } as unknown as Response;

    const handler = logoutController(client, middlewareOptions);

    const req = {} as Request;
    await handler(req, res);
    expect(res.clearCookie).toHaveBeenCalledWith('SMSESSION', {
      domain: '.gov.bc.ca',
      secure: true,
    });
  });

  it('redirects to the base url if the user is already logged out', async () => {
    const res = {
      clearCookie: jest.fn(),
      redirect: jest.fn(),
    } as unknown as Response;

    const handler = logoutController(client, middlewareOptions);

    const req = {} as Request;
    await handler(req, res);
    expect(res.redirect).toHaveBeenCalledWith('http://localhost:3000/');
  });

  it("redirects to the provider's logout endpoint if the user is authenticated", async () => {
    const res = {
      clearCookie: jest.fn(),
      redirect: jest.fn(),
    } as unknown as Response;

    const handler = logoutController(client, middlewareOptions);

    const req = {
      session: { tokenSet: {} },
    } as Request;
    mocked(isAuthenticated).mockReturnValue(true);
    await handler(req, res);
    expect(res.redirect).toHaveBeenCalledWith('http://localhost:3000/');
  });

  it('removes the tokenset from the session', async () => {
    const res = {
      clearCookie: jest.fn(),
      redirect: jest.fn(),
    } as unknown as Response;

    const handler = logoutController(client, middlewareOptions);

    const req = {
      session: { tokenSet: {} },
    } as Request;
    mocked(isAuthenticated).mockReturnValue(true);
    await handler(req, res);
    expect(req.session).toEqual({});
  });
});

describe('the tokenSet controller', () => {
  it('tries to refresh the access token if it is expired', async () => {
    mocked(isAuthenticated).mockReturnValue(true);
    const req = {
      session: { tokenSet: {} },
      claims: undefined,
    } as Request;
    const res = {} as Response;
    const next = jest.fn();

    const expiredTokenSet = {
      expired: () => true,
      claims: jest.fn(),
    } as TokenSet;

    const newClaims = {};

    const newTokenSet = {
      expired: () => false,
      claims: jest.fn().mockReturnValue(newClaims),
    } as TokenSet;

    mocked(TokenSet).mockImplementation(() => expiredTokenSet);
    mocked(client.refresh).mockResolvedValue(newTokenSet);

    const handler = tokenSetController(client, middlewareOptions);
    await handler(req, res, next);
    expect(client.refresh).toHaveBeenCalledWith(expiredTokenSet);
    expect(expiredTokenSet.claims).toHaveBeenCalledTimes(0);
    expect(newTokenSet.claims).toHaveBeenCalled();
    expect(req.session.tokenSet).toEqual(newTokenSet);
    expect(req.claims).toBe(newClaims);
    expect(next).toHaveBeenCalled();
  });

  it('only adds the claims to the request if the token set is not expired', async () => {
    mocked(isAuthenticated).mockReturnValue(true);
    const req = {
      session: { tokenSet: {} },
      claims: undefined,
    } as Request;
    const res = {} as Response;
    const next = jest.fn();

    const newClaims = {};

    const tokenSet = {
      expired: () => false,
      claims: jest.fn().mockReturnValue(newClaims),
    } as TokenSet;

    mocked(TokenSet).mockImplementation(() => tokenSet);

    const handler = tokenSetController(client, middlewareOptions);
    await handler(req, res, next);
    expect(client.refresh).toHaveBeenCalledTimes(0);
    expect(tokenSet.claims).toHaveBeenCalledTimes(1);
    expect(req.session.tokenSet).toEqual(tokenSet);
    expect(req.claims).toBe(newClaims);
    expect(next).toHaveBeenCalled();
  });

  it('removes the token set from the session if the token refresh fails', async () => {
    const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation();
    mocked(isAuthenticated).mockReturnValue(true);
    const req = {
      session: { tokenSet: {} },
      claims: undefined,
    } as Request;
    const res = {} as Response;
    const next = jest.fn();

    const expiredTokenSet = {
      expired: () => true,
      claims: jest.fn(),
    } as TokenSet;

    mocked(TokenSet).mockImplementation(() => expiredTokenSet);
    mocked(client.refresh).mockRejectedValue(new Error('refresh failed'));

    const handler = tokenSetController(client, middlewareOptions);
    await handler(req, res, next);
    expect(client.refresh).toHaveBeenCalledWith(expiredTokenSet);
    expect(req.session.tokenSet).toBeUndefined();
    expect(req.claims).toBeUndefined();
    expect(next).toHaveBeenCalled();
    expect(consoleErrorMock).toHaveBeenCalledTimes(1);
    expect(consoleErrorMock.mock.calls).toEqual([
      [
        'sso-express could not refresh the access token.',
        expect.any(Error),
      ],
    ]);
    consoleErrorMock.mockRestore();
  });
});

describe('the sessionIdleRemainingTimeController', () => {
  it('returns the remaining time', async () => {
    const handler = sessionIdleRemainingTimeController(
      client,
      middlewareOptions
    );
    const req = {} as Request;
    const res = {
      json: jest.fn(),
    } as unknown as Response;
    mocked(getSessionRemainingTime).mockReturnValue(123);
    await handler(req, res);
    expect(res.json).toHaveBeenCalledWith(123);
  });

  it('returns a mocked time if authentication is bypassed', async () => {
    const handler = sessionIdleRemainingTimeController(client, {
      ...middlewareOptions,
      bypassAuthentication: { sessionIdleRemainingTime: true },
    });
    const req = {} as Request;
    const res = {
      json: jest.fn(),
    } as unknown as Response;
    mocked(getSessionRemainingTime).mockReturnValue(123);
    await handler(req, res);
    expect(res.json).toHaveBeenCalledWith(3600);
  });
});

describe('the loginController', () => {
  it('redirects to the landing route if the user is already logged in', async () => {
    mocked(isAuthenticated).mockReturnValue(true);
    mocked(middlewareOptions.getLandingRoute).mockReturnValue('/landing');
    const handler = loginController(client, middlewareOptions);
    const req = {} as Request;
    const res = {
      redirect: jest.fn(),
    } as unknown as Response;
    await handler(req, res);
    expect(middlewareOptions.getLandingRoute).toHaveBeenCalledWith(req);
    expect(res.redirect).toHaveBeenCalledWith(302, '/landing');
  });

  it('redirects to the landing route if authentication is bypassed', async () => {
    mocked(isAuthenticated).mockReturnValue(false);
    mocked(middlewareOptions.getLandingRoute).mockReturnValue('/landing');
    const handler = loginController(client, {
      ...middlewareOptions,
      bypassAuthentication: { login: true },
    });
    const req = {} as Request;
    const res = {
      redirect: jest.fn(),
    } as unknown as Response;
    await handler(req, res);
    expect(middlewareOptions.getLandingRoute).toHaveBeenCalledWith(req);
    expect(res.redirect).toHaveBeenCalledWith(302, '/landing');
  });

  it('adds a randomly-generated OpenID state to the session', async () => {
    mocked(isAuthenticated).mockReturnValue(false);
    mocked(generators.random).mockReturnValue('some-random-state');
    mocked(middlewareOptions.getRedirectUri).mockImplementationOnce(
      (defaultRedirectUri) => defaultRedirectUri
    );
    const handler = loginController(client, middlewareOptions);
    const req = { session: {} } as Request;
    const res = {
      redirect: jest.fn(),
    } as unknown as Response;
    await handler(req, res);
    expect(generators.random).toHaveBeenCalledWith(32);
  });

  it("redirects the user to the provider's auth URL, and saves the redirectUri in the session", async () => {
    const mockCodeVerifier = 'some-random-state';
    const mockCodeChallenge = Buffer.from(
      createHash('sha256').update(mockCodeVerifier).digest()
    ).toString();
    mocked(isAuthenticated).mockReturnValue(false);
    mocked(generators.random).mockReturnValue(mockCodeVerifier);
    mocked(generators.codeVerifier).mockReturnValue(mockCodeVerifier);
    mocked(generators.codeChallenge).mockReturnValue(mockCodeChallenge);
    mocked(client.authorizationUrl).mockReturnValue('https://auth.url');

    const url = new URL('http://example.com/callback');
    url.searchParams.append('test', '/path/abc');
    mocked(middlewareOptions.getRedirectUri).mockReturnValueOnce(url);

    const handler = loginController(client, middlewareOptions);
    const req = { session: {} } as Request;
    const res = {
      redirect: jest.fn(),
    } as unknown as Response;
    await handler(req, res);

    expect(client.authorizationUrl).toHaveBeenCalledWith({
      state: mockCodeVerifier,
      code_challenge: mockCodeChallenge,
      code_challenge_method: 'S256',
      redirect_uri: 'http://example.com/callback?test=%2Fpath%2Fabc',
    });
    expect(middlewareOptions.getRedirectUri).toHaveBeenCalledWith(
      // We verify that the getRedirectUri function has been called with the default redirect URI
      new URL('https://example.com/auth-callback'),
      {
        session: {
          codeVerifier: 'some-random-state',
          redirectUri: 'http://example.com/callback?test=%2Fpath%2Fabc',
        },
      }
    );
    expect(res.redirect).toHaveBeenCalledWith('https://auth.url');
  });

  it('adds provided url params to the auth URL', async () => {
    mocked(isAuthenticated).mockReturnValue(false);
    const url = new URL('http://example.com/callback');
    url.searchParams.append('test', '/path/abc');
    mocked(middlewareOptions.getRedirectUri).mockReturnValueOnce(url);
    const middlewareOptionsWithURLParams = {
      ...middlewareOptions,
      authorizationUrlParams: { param1: 'value1', param2: 'value2' },
    };
    const handler = loginController(client, middlewareOptionsWithURLParams);
    const req = { session: {} } as Request;
    const res = {
      redirect: jest.fn(),
    } as unknown as Response;
    handler(req, res);
    expect(client.authorizationUrl).toHaveBeenCalledWith({
      state: expect.anything(),
      code_challenge: expect.anything(),
      code_challenge_method: expect.anything(),
      redirect_uri: expect.anything(),
      param1: 'value1',
      param2: 'value2',
    });
    expect(res.redirect).toHaveBeenCalledWith('https://auth.url');
  });

  it('calls the authorizationURLParams function if provided', async () => {
    mocked(isAuthenticated).mockReturnValue(false);
    const url = new URL('http://example.com/callback');
    url.searchParams.append('test', '/path/abc');

    const authorizationUrlParams = jest.fn(() => {
      return {
        param1: 'value1',
        param2: 'value2',
      };
    });

    mocked(middlewareOptions.getRedirectUri).mockReturnValueOnce(url);
    const middlewareOptionsWithURLParams = {
      ...middlewareOptions,
      authorizationUrlParams,
    };
    const handler = loginController(client, middlewareOptionsWithURLParams);
    const req = { session: {} } as Request;
    const res = {
      redirect: jest.fn(),
    } as unknown as Response;
    handler(req, res);
    expect(client.authorizationUrl).toHaveBeenCalledWith({
      state: expect.anything(),
      code_challenge: expect.anything(),
      code_challenge_method: expect.anything(),
      redirect_uri: expect.anything(),
      param1: 'value1',
      param2: 'value2',
    });
    expect(authorizationUrlParams).toHaveBeenCalledWith(req);
    expect(res.redirect).toHaveBeenCalledWith('https://auth.url');
  });

  it('does not add a randomly-generated code_challenge to the session when odicConfig.clientSecret is unset', async () => {
    mocked(isAuthenticated).mockReturnValue(false);
    const mockCodeVerifier = 'some-random-state';
    const mockCodeChallenge = Buffer.from(
      createHash('sha256').update(mockCodeVerifier).digest()
    ).toString();
    mocked(generators.codeVerifier).mockReturnValue(mockCodeVerifier);
    mocked(generators.codeChallenge).mockReturnValue(mockCodeChallenge);
    mocked(middlewareOptions.getRedirectUri).mockImplementationOnce(
      (defaultRedirectUri) => defaultRedirectUri
    );
    const handler = loginController(client, middlewareOptions);
    const req = { session: {} } as Request;
    const res = {
      redirect: jest.fn(),
    } as unknown as Response;
    await handler(req, res);
    expect(generators.codeVerifier).toHaveBeenCalledWith(32);
    expect(generators.codeChallenge).toHaveBeenCalledWith(mockCodeVerifier);
    expect(client.authorizationUrl).toHaveBeenCalledWith({
      state: mockCodeVerifier,
      code_challenge: mockCodeChallenge,
      code_challenge_method: 'S256',
      redirect_uri: 'https://example.com/auth-callback',
    });
    expect(req.session.codeVerifier).toBe(mockCodeVerifier);
  });
});

describe('the authCallbackController', () => {
  it('fetches the tokenSet, calls the callback with the redirectUri from the session, and redirects to the landing route', async () => {
    const handler = authCallbackController(client, middlewareOptions);
    const req = {
      session: {
        oidcState: 'some-state',
        redirectUri: 'http://example.com/redirected-uri',
      },
      query: {
        state: 'some-state',
      },
    } as unknown as Request;
    const res = {
      redirect: jest.fn(),
    } as unknown as Response;

    const claims = {};
    const callbackParams = {};
    const tokenSet = {
      claims: jest.fn().mockReturnValue(claims),
    } as unknown as TokenSet;
    mocked(client.callbackParams).mockReturnValue(callbackParams);
    mocked(client.callback).mockResolvedValue(tokenSet);
    mocked(middlewareOptions.getLandingRoute).mockReturnValue('/landing');

    await handler(req, res);

    expect(res.redirect).toHaveBeenCalledWith('/landing');
    expect(client.callbackParams).toHaveBeenCalledWith(req);
    expect(tokenSet.claims).toHaveBeenCalled();
    expect(client.callback).toHaveBeenCalledWith(
      'http://example.com/redirected-uri',
      callbackParams,
      {
        state: 'some-state',
      }
    );
    expect(req.claims).toBe(claims);
    expect(req.session.tokenSet).toBe(tokenSet);
    // onAuthCallback has been disabled, temporarily
    // disabling this test
    // expect(middlewareOptions.onAuthCallback).toHaveBeenCalledWith(
    //   expect.objectContaining({
    //     claims,
    //     session: expect.objectContaining({ tokenSet }),
    //   })
    // );
  });

  it('redirects to the base URL if it cannot fetch the tokenSet', async () => {
    const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation();
    const handler = authCallbackController(client, middlewareOptions);
    const req = {
      session: { oidcState: 'some-state', redirectUri: 'testUri' },
      query: {
        state: 'some-state',
      },
    } as unknown as Request;
    const res = {
      redirect: jest.fn(),
    } as unknown as Response;

    const callbackParams = {};

    mocked(client.callbackParams).mockReturnValue(callbackParams);
    mocked(client.callback).mockRejectedValue(new Error('some-error'));
    mocked(middlewareOptions.getRedirectUri).mockImplementationOnce(
      (defaultRedirectUri) => defaultRedirectUri
    );

    await handler(req, res);

    expect(res.redirect).toHaveBeenCalledWith(
      middlewareOptions.oidcConfig.baseUrl
    );
    expect(client.callbackParams).toHaveBeenCalledWith(req);
    expect(client.callback).toHaveBeenCalledWith('testUri', callbackParams, {
      state: 'some-state',
    });
    expect(req.claims).toBe(undefined);
    expect(req.session.tokenSet).toBe(undefined);
    expect(consoleErrorMock.mock.calls).toEqual([
      ['sso-express could not get the access token.', expect.any(Error)],
    ]);
    expect(middlewareOptions.onAuthCallback).toHaveBeenCalledTimes(0);
    consoleErrorMock.mockRestore();
  });
});
