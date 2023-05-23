import { Router } from 'express';
import getLinkPreview from '../../utils/getLinkPreview';
import getAuthRole from '../../utils/getAuthRole';

const allowedHostnames = [
  'news.gov.bc.ca',
  'gov.bc.ca',
  'canada.ca',
  'www.canada.ca',
  'www2.gov.bc.ca',
];

const linkPreview = Router();

linkPreview.post('/api/announcement/linkPreview', async (req, res) => {
  const authRole = getAuthRole(req);
  const isRoleAuthorized = authRole?.pgRole === 'ccbc_admin';
  if (!isRoleAuthorized) {
    res.status(404).end();
  } else {
    const { url } = req.body;
    try {
      const urlObj = new URL(url);
      if (!allowedHostnames.includes(urlObj.hostname)) {
        res.json({
          title: null,
          description: 'No preview available',
          image: '/images/noPreview.png',
        });
      } else {
        const preview = await getLinkPreview(
          `https://${urlObj.hostname}${urlObj.pathname}`
        ).catch((e) => {
          throw new Error(e);
        });
        res.json(preview);
      }
    } catch (e) {
      res.json({
        title: null,
        description: 'No preview available',
        image: '/images/noPreview.png',
      });
    }
  }
});

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};

export default linkPreview;
