import { isAuthenticated } from '@bcgov-cas/sso-express';
import type { Request } from 'express';
import config from '../../../config';
import getAuthRole from '../../../utils/getAuthRole';

const authenticationPgSettings = (req: Request) => {
  const claimsSettings: any = {
    role: getAuthRole(req).pgRole,
  };

  if (config.get('ENABLE_MOCK_AUTH'))
    claimsSettings['jwt.claims.sub'] = `mockUser@${claimsSettings.role}`;

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

  return {
    ...claimsSettings,
  };
};

export default authenticationPgSettings;
