import { Router } from 'express';
import RateLimit from 'express-rate-limit';
import getLinkPreview from '../../utils/getLinkPreview';
import getAuthRole from '../../utils/getAuthRole';
import { performQuery } from './graphql';
import { reportServerError } from './emails/errorNotification';

const limiter = RateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 2000,
});

const saveLinkPreviewMutation = `
  mutation linkPreviewMutation($input: JSON!, $id: Int!, $ccbcNumbers: String!, $updateOnly: Boolean!) {
    updateAnnouncement(input: {jsonData: $input, oldRowId: $id, projectNumbers: $ccbcNumbers, updateOnly: $updateOnly}) {
      announcement {
        id,
        rowId,
      },
      clientMutationId
    }
  }
`;

const allowedHostnames = [
  'news.gov.bc.ca',
  'gov.bc.ca',
  'canada.ca',
  'www.canada.ca',
  'www2.gov.bc.ca',
];

const linkPreview = Router();

// eslint-disable-next-line consistent-return
linkPreview.post('/api/announcement/linkPreview', limiter, (req, res) => {
  const authRole = getAuthRole(req);
  const isRoleAuthorized =
    authRole?.pgRole === 'ccbc_admin' ||
    authRole?.pgRole === 'ccbc_analyst' ||
    authRole?.pgRole === 'super_admin' ||
    authRole?.pgRole === 'cbc_admin';
  if (!isRoleAuthorized) {
    return res.status(404).end();
  }
  const { url, jsonData, rowId, ccbcNumbers } = req.body;
  let urlObj;
  try {
    // attempt to fix url if it doesn't have http or https
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      urlObj = new URL(`https://${url}`);
    } else {
      urlObj = new URL(url);
    }
    // check if URL has a domain
    if (!urlObj.hostname.includes('.')) {
      return res.status(400).json({ error: 'Invalid URL' }).end();
    }
  } catch (e) {
    reportServerError(e, { source: 'link-preview-url-parse', metadata: { url } }, req);
    return res.status(400).json({ error: 'Invalid URL' }).end();
  }
  if (!allowedHostnames.includes(urlObj.hostname)) {
    // update the db with the preview
    jsonData.preview = {
      title: null,
      description: 'No preview available',
      image: '/images/noPreview.png',
    };
    jsonData.previewed = true;
    (async () => {
      await performQuery(
        saveLinkPreviewMutation,
        { input: jsonData, id: rowId, ccbcNumbers, updateOnly: true },
        req
      ).catch((e) => {
        reportServerError(
          e,
          { source: 'link-preview-save-no-preview' },
          req
        );
        return res.status(400).json({ error: e }).end();
      });
    })();
    return res
      .status(200)
      .json({
        title: null,
        description: 'No preview available',
        image: '/images/noPreview.png',
      })
      .end();
  }
  let preview;
  (async () => {
    preview = await getLinkPreview(
      `https://${urlObj.hostname}${urlObj.pathname}`,
      allowedHostnames
    ).catch((e) => {
      reportServerError(e, { source: 'link-preview-fetch' }, req);
      return res.status(400).json({ error: e }).end();
    });
    if (preview) {
      // update the db with the preview
      jsonData.preview = preview;
      jsonData.previewed = true;
      await performQuery(
        saveLinkPreviewMutation,
        { input: jsonData, id: rowId, ccbcNumbers, updateOnly: true },
        req
      ).catch((e) => {
        reportServerError(e, { source: 'link-preview-save' }, req);
        return res.status(400).json({ error: e }).end();
      });
      return res.status(200).json(preview).end();
    }
    return res.status(400).json({ error: 'Failed to get a preview' }).end();
  })();
});

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};

export default linkPreview;
