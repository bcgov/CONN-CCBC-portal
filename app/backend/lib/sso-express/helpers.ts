import type { Request } from 'express';
import { TokenSet } from 'openid-client';

export const isAuthenticated = (req: Request) => {
  const tokenSet = new TokenSet(req.session?.tokenSet);
  return (
    !!req.session?.tokenSet && !!tokenSet.refresh_token && !tokenSet.expired()
  );
};

const decodeJwt = (token: string) => {
  const [header, payload, signature] = token.split('.');
  return {
    header: JSON.parse(Buffer.from(header, 'base64').toString('utf8')),
    payload: JSON.parse(Buffer.from(payload, 'base64').toString('utf8')),
    signature,
  };
};

export const getSessionRemainingTime = (req: Request) => {
  if (!isAuthenticated(req)) {
    return 0;
  }
  const refreshToken = decodeJwt(req.session.tokenSet.refresh_token);
  return Math.round(refreshToken.payload.exp - Date.now() / 1000);
};
