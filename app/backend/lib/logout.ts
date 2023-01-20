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
  req.logout(() => {
    const idp = req.claims?.identity_provider;
    const baseRoute = idp === 'idir' ? '/analyst' : '/';

    const logoutUrl = `${siteminderUrl}?retnow=1&returl=${authServerUrl}/protocol/openid-connect/logout?redirect_uri=${encodeURI(
      `${baseUrl}${baseRoute}`
    )}`;

    req.session.destroy(() => {
      res.clearCookie('connect.sid');
      res.redirect(logoutUrl);
    });
  });
});

export default logout;
