import { isAuthenticated } from '@bcgov-cas/sso-express';
import type { Request } from 'express';
import config from '../../../config';
import getAuthRole from '../../../utils/getAuthRole';

const authenticationPgSettings = (req: Request) => {
  if (config.get('ENABLE_MOCK_AUTH')) {
    return {
      'jwt.claims.sub': '00000000-0000-0000-0000-000000000000',
      role: 'ccbc_auth_user',
    };
  }

  const claimsSettings: any = {
    role: 'ccbc_guest',
  };
  if (!isAuthenticated(req))
    return {
      ...claimsSettings,
    };

  const { claims } = req;

  const properties = [
    'jti',
    'exp',
    'nbf',
    'iat',
    'iss',
    'aud',
    'sub',
    'typ',
    'azp',
    'auth_time',
    'session_state',
    'acr',
    'email_verified',
    'name',
    'preferred_username',
    'given_name',
    'family_name',
    'email',
    'broker_session_id',
    'user_groups',
    'priority_group',
    'identity_provider',
  ];

  properties.forEach((property) => {
    claimsSettings[`jwt.claims.${property}`] = claims![property];
  });
  // TODO - look at roles/ claims to determine the correct database role when that becomes a required feature
  claimsSettings.role = getAuthRole(req).pgRole;

  return {
    ...claimsSettings,
  };
};

export default authenticationPgSettings;
