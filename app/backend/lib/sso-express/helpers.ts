import type { Request } from 'express';
import { TokenSet } from 'openid-client';

const decodeJwt = (token: string) => {
  const [header, payload, signature] = token.split('.');
  return {
    header: JSON.parse(Buffer.from(header, 'base64').toString('utf8')),
    payload: JSON.parse(Buffer.from(payload, 'base64').toString('utf8')),
    signature,
  };
};

export const isAuthenticated = (req: Request) => {
  const tokenSet = new TokenSet(req.session?.tokenSet);
  const isRefreshTokenExpired = tokenSet?.refreshToken
    ? decodeJwt(tokenSet?.refresh_token).payload.exp < Date.now() / 1000
    : false;
  return !!req.session?.tokenSet && !isRefreshTokenExpired;
};

export const getSessionRemainingTime = (req: Request) => {
  if (!isAuthenticated(req)) {
    return 0;
  }
  const refreshToken = decodeJwt(req.session.tokenSet.refresh_token);
  const accessToken = decodeJwt(req.session.tokenSet.access_token);
  if (accessToken.payload.exp > refreshToken.payload.exp) {
    return Math.round(accessToken.payload.exp - Date.now() / 1000);
  }
  return Math.round(refreshToken.payload.exp - Date.now() / 1000);
};
