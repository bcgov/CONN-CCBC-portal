import { Router } from 'express';
import getLinkPreview from '../../utils/getLinkPreview';
import getAuthRole from '../../utils/getAuthRole';

const linkPreview = Router();

linkPreview.post('/api/announcement/linkPreview', async (req, res) => {
  const authRole = getAuthRole(req);
  const isRoleAuthorized = authRole?.pgRole === 'ccbc_admin';
  if (!isRoleAuthorized) {
    return res.status(404).end();
  }
  const { url } = req.body;
  const preview = await getLinkPreview(url);
  return res.json(preview);
});

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};

export default linkPreview;
