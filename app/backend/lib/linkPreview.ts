import { Router } from 'express';
import getLinkPreview from '../../utils/getLinkPreview';
import getAuthRole from '../../utils/getAuthRole';

const allowedHostnames = ['gov.bc.ca', 'canada.ca'];

const linkPreview = Router();

linkPreview.post('/api/announcement/linkPreview', async (req, res) => {
  const authRole = getAuthRole(req);
  const isRoleAuthorized = authRole?.pgRole === 'ccbc_admin';
  if (!isRoleAuthorized) {
    return res.status(404).end();
  }
  const { url } = req.body;
  try {
    const urlObj = new URL(url);
    if (!allowedHostnames.includes(urlObj.hostname)) {
      return res.json({
        title: 'No preview available',
        description: 'No preview available',
        image: '/images/noPreview.png',
      });
    }
    const preview = await getLinkPreview(
      `https://${urlObj.hostname}${urlObj.pathname}`,
      allowedHostnames
    );
    return res.json(preview);
  } catch (e) {
    return res.json({
      title: 'No preview available',
      description: 'No preview available',
      image: '/images/noPreview.png',
    });
  }
});

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};

export default linkPreview;
