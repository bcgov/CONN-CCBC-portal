import { Issuer } from 'openid-client';
import decodeJwt from '../../utils/decodeJwt';
import config from '../../config';
import { reportServerError } from './emails/errorNotification';

const oidcIssuer = config.get('AUTH_SERVER_URL');
const clientId = config.get('KEYCLOAK_SA_CLIENT_ID');
const clientSecret = config.get('KEYCLOAK_SA_CLIENT_SECRET');

// Middleware function to validate Keycloak bearer token
// eslint-disable-next-line consistent-return
const validateKeycloakToken = (req, res, next) => {
  (async () => {
    // Initialize Keycloak issuer
    try {
      const keycloakIssuer = await Issuer.discover(oidcIssuer);
      // Client configuration
      const client = new keycloakIssuer.Client({
        client_id: clientId,
        client_secret: clientSecret,
      });

      const token = req.headers.authorization?.split(' ')[1];
      const decodedToken = decodeJwt(token).payload;

      if (!token) {
        return res
          .status(401)
          .json({ error: 'Unauthorized: No token provided.' });
      }

      const userInfo = await client.userinfo(token);

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
      return next();
    } catch (error) {
      reportServerError(error, { source: 'keycloak-validate' }, req);
      return res.status(401).json({ error: 'Unauthorized: Invalid token.' });
    }
  })();
};

export default validateKeycloakToken;
