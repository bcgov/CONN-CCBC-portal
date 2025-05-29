import { Router } from 'express';
import config from '../../config';

const baseUrl =
  config.get('NODE_ENV') === 'production'
    ? `https://${config.get('HOST')}`
    : `http://${config.get('HOST')}:${config.get('PORT') || 3000}`;

const authServerUrl = config.get('AUTH_SERVER_URL');
const siteminderUrl = config.get('SITEMINDER_LOGOUT_URL');

const logout = Router();

logout.post('/api/logout', async (req: any, res) => {
  const idToken = req?.session?.tokenSet?.id_token;
  req.logout(() => {
    const idp = req.claims?.identity_provider;
    const roles = req.claims?.client_roles || [];
    let isAnalyst =
      roles?.includes('analyst') ||
      roles?.includes('admin') ||
      roles?.includes('cbc_admin') ||
      roles?.includes('super_admin');
    console.log('roles upon logout:', roles);
    // if no role, check cookie roles
    // as claims might be cleared by the time of auto logout
    if (roles.length === 0) {
      const cookieRoles = req.cookies?.role || null;
      console.log('cookie roles upon logout:', cookieRoles);
      if (cookieRoles) {
        if (
          cookieRoles === 'analyst' ||
          cookieRoles === 'admin' ||
          cookieRoles === 'cbc_admin' ||
          cookieRoles === 'super_admin'
        ) {
          isAnalyst = true;
        }
      }
    }
    const baseRoute = isAnalyst ? '/analyst' : '/';

    const postLogoutRedirectUri = encodeURIComponent(`${baseUrl}${baseRoute}`);
    const keycloakLogoutUrl = `${authServerUrl}/protocol/openid-connect/logout?id_token_hint=${encodeURIComponent(idToken)}&post_logout_redirect_uri=${postLogoutRedirectUri}`;

    const logoutUrl =
      idp !== 'azureidir'
        ? `${siteminderUrl}?retnow=1&returl=${encodeURIComponent(keycloakLogoutUrl)}`
        : keycloakLogoutUrl;

    req.session.destroy(() => {
      res.clearCookie('analyst.sort');
      res.clearCookie('connect.sid');
      res.redirect(logoutUrl);
    });
  });
});

export default logout;
