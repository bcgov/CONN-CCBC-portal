import { Issuer } from 'openid-client';
import config from '../../config';

const oidcIssuer = config.get('AUTH_SERVER_URL');
const clientId = config.get('KEYCLOAK_SA_CLIENT_ID');
const clientSecret = config.get('KEYCLOAK_SA_CLIENT_SECRET');

const decodeJwt = (token: string) => {
  const [header, payload, signature] = token.split('.');
  return {
    header: JSON.parse(Buffer.from(header, 'base64').toString('utf8')),
    payload: JSON.parse(Buffer.from(payload, 'base64').toString('utf8')),
    signature,
  };
};

// Middleware function to validate Keycloak bearer token
// eslint-disable-next-line consistent-return
const validateKeycloakToken = async (req, res, next) => {
  // Initialize Keycloak issuer
  const keycloakIssuer = await Issuer.discover(oidcIssuer);

  // Client configuration
  const client = new keycloakIssuer.Client({
    client_id: clientId,
    client_secret: clientSecret,
  });

  const token = req.headers.authorization?.split(' ')[1];
  const decodedToken = decodeJwt(token).payload;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: No token provided.' });
  }

  try {
    const userInfo = await client.userinfo(token);
    console.log(decodedToken, userInfo);
    if (
      decodedToken.iss !== oidcIssuer ||
      decodedToken.aud !== clientId ||
      (userInfo.client_roles as string[]).indexOf('trigger-import') === -1
    ) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token.' });
    }
    // attach claim info
    req.claims = req.claims || {};
    req.claims.client_roles = userInfo.client_roles;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ error: 'Unauthorized: Invalid token.' });
  }
};

export default validateKeycloakToken;
