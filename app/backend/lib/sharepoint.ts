import { Router } from 'express';
import * as XLSX from 'xlsx';
import * as spauth from 'node-sp-auth';
import config from '../../config';

const SP_SITE = config.get('SP_SITE');
const SP_DOC_LIBRARY = config.get('SP_DOC_LIBRARY');
const SP_FILE_NAME = config.get('SP_MS_FILE_NAME');
const SP_SA_USER = config.get('SP_SA_USER');
const SP_SA_PASSWORD = config.get('SP_SA_PASSWORD');

const sharepoint = Router();

sharepoint.get('/api/sharepoint/masterSpreadsheet', async (req, res) => {
  const responseOBject = { metadata: null, sheets: null };
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
  if (metadata.ok) {
    responseOBject.metadata = await metadata.json();
    responseOBject.metadata = responseOBject?.metadata || null;
  }
  const file = await fetch(
    `${SP_SITE}/_api/web/GetFolderByServerRelativeUrl('${SP_DOC_LIBRARY}')/Files('${SP_FILE_NAME}')/$value
    `,
    {
      method: 'GET',
      headers: authHeaders,
    }
  );
  if (file.ok) {
    const bufferResponse = await file.arrayBuffer();
    const wb = XLSX.read(bufferResponse);
    responseOBject.sheets = wb.SheetNames as any;
  }
  res.json(responseOBject).end();
});

export default sharepoint;
