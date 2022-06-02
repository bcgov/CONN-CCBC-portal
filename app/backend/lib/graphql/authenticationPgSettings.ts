import { isAuthenticated } from '@bcgov-cas/sso-express';
import type { Request } from 'express';

const authenticationPgSettings = (req: Request) => {
  const claimsSettings: any = {
    role: 'ccbc_guest',
  };
  // if (!isAuthenticated(req))
  //   return {
  //     claimsSettings,
  //   };

  // const claims = req.claims;

  // const properties = [
  //   'jti',
  //   'exp',
  //   'nbf',
  //   'iat',
  //   'iss',
  //   'aud',
  //   'sub',
  //   'typ',
  //   'azp',
  //   'auth_time',
  //   'session_state',
  //   'acr',
  //   'email_verified',
  //   'name',
  //   'preferred_username',
  //   'given_name',
  //   'family_name',
  //   'email',
  //   'idir_userid',
  //   'broker_session_id',
  //   'user_groups',
  //   'priority_group',
  // ];
  // properties.forEach((property) => {
  //   claimsSettings[`jwt.claims.${property}`] = claims![property];
  // });
  // // TODO - look at roles/ claims to determine the correct database role when that becomes a required feature
  claimsSettings.role = 'ccbc_guest';

  return {
    ...claimsSettings,
  };
};

export default authenticationPgSettings;
