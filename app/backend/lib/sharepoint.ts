import { Router } from 'express';
import * as XLSX from 'xlsx';
import * as spauth from '@bcgov-ccbc/ccbc-node-sp-auth';
import config from '../../config';
import getAuthRole from '../../utils/getAuthRole';

const SP_SITE = config.get('SP_SITE');
const SP_DOC_LIBRARY = config.get('SP_DOC_LIBRARY');
const SP_FILE_NAME = config.get('SP_MS_FILE_NAME');
const SP_SA_USER = config.get('SP_SA_USER');
const SP_SA_PASSWORD = config.get('SP_SA_PASSWORD');

const sharepoint = Router();

// eslint-disable-next-line consistent-return
sharepoint.get('/api/sharepoint/masterSpreadsheet', (req, res) => {
  const authRole = getAuthRole(req);
  const isRoleAuthorized = authRole?.pgRole === 'ccbc_admin';

  if (!isRoleAuthorized) {
    return res.status(404).end();
  }
  (async () => {
    const authHeaders = await spauth
      .getAuth(SP_SITE, {
        username: SP_SA_USER,
        password: SP_SA_PASSWORD,
      })
      .then(async (data) => {
        const { headers } = data;
        headers['Accept'] = 'application/json;odata=verbose';
        headers['Content-Type'] = 'application/json';
        return headers;
      });

    const metadata = await fetch(
      `${SP_SITE}/_api/web/GetFolderByServerRelativeUrl('${SP_DOC_LIBRARY}')/Files('${SP_FILE_NAME}')
    `,
      {
        method: 'GET',
        headers: authHeaders,
      }
    );
    const file = await fetch(
      `${SP_SITE}/_api/web/GetFolderByServerRelativeUrl('${SP_DOC_LIBRARY}')/Files('${SP_FILE_NAME}')/$value
    `,
      {
        method: 'GET',
        headers: authHeaders,
      }
    );
    if (metadata.ok && file.ok) {
      const bufferResponse = await file.arrayBuffer();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const wb = XLSX.read(bufferResponse);
      // TODO: check if metadata.TimeLastModified is different from the last time we imported the data
      // TODO: add logic to parse the workbook and insert data to DB
    } else {
      return res.sendStatus(500);
    }
    return res.sendStatus(200);
  })();
});

export default sharepoint;
