import { Router } from 'express';
import jwt from 'jsonwebtoken';
import config from '../../config/index';
import getAuthRole from '../../utils/getAuthRole';

const METABASE_SITE_URL = config.get('METABASE_SITE_URL');
const METABASE_EMBED_SECRET = config.get('METABASE_EMBED_SECRET');

const metabaseEmbedUrl = Router();

metabaseEmbedUrl.get(
  '/api/metabase-embed-url/:dashboard',

  (req: any, res) => {
    const authRole = getAuthRole(req);
    const isRoleAuthorized =
      authRole?.pgRole === 'ccbc_admin' ||
      authRole?.pgRole === 'ccbc_analyst' ||
      authRole?.pgRole === 'super_admin';
    if (!isRoleAuthorized) {
      return res.status(404).end();
    }
    const { dashboard } = req.params;

    const payload = {
      resource: { dashboard: parseInt(dashboard, 10) },
      params: {},
      exp: Math.round(Date.now() / 1000) + 10 * 60, // 10 minute expiration
    };

    // sign the JWT token with our secret key
    const signedToken = jwt.sign(payload, METABASE_EMBED_SECRET);
    // construct the URL of the iframe to be displayed
    const iframeUrl = `${METABASE_SITE_URL}/embed/dashboard/${signedToken}#bordered=false&titled=false`;

    return res.status(200).json({ url: iframeUrl }).end();
  }
);

export default metabaseEmbedUrl;
