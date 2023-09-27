import { Router } from 'express';
import * as XLSX from 'xlsx';
import * as spauth from '@bcgov-ccbc/ccbc-node-sp-auth';
import config from '../../config';
import getAuthRole from '../../utils/getAuthRole';
import LoadCbcProjectData from './excel_import/cbc_project';

const SP_SITE = config.get('SP_SITE');
const SP_DOC_LIBRARY = config.get('SP_DOC_LIBRARY');
const SP_FILE_NAME = config.get('SP_MS_FILE_NAME');
const SP_SA_USER = config.get('SP_SA_USER');
const SP_SA_PASSWORD = config.get('SP_SA_PASSWORD');

const sharepoint = Router();

// eslint-disable-next-line consistent-return
sharepoint.get('/api/sharepoint/cbc-project', (req, res) => {
  const authRole = getAuthRole(req);
  const isRoleAuthorized = authRole?.pgRole === 'ccbc_admin';

  if (!isRoleAuthorized) {
    return res.status(404).end();
  }

  const errorList = [];

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

    const metadata = (await fetch(
      `${SP_SITE}/_api/web/GetFolderByServerRelativeUrl('${SP_DOC_LIBRARY}')/Files('${SP_FILE_NAME}')
    `,
      {
        method: 'GET',
        headers: authHeaders,
      }
    )) as any;
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

      const sheet = 'CBC Projects';
      // Throw error if sheet is not found
      if (!wb.SheetNames.includes(sheet)) {
        errorList.push({
          level: 'workbook',
          error: `missing required sheet "${sheet}". Found: ${JSON.stringify(
            wb.SheetNames
          )}`,
        });
      }

      if (errorList.length > 0) {
        return res.status(400).json(errorList).end();
      }
      const metadataJson = await metadata.json();
      const sharepointTimestamp = metadataJson?.d?.TimeLastModified;

      const result = await LoadCbcProjectData(
        wb,
        sheet,
        sharepointTimestamp,
        req
      );
      // TODO: check if metadata.TimeLastModified is different from the last time we imported the data
      // TODO: add logic to parse the workbook and insert data to DB
    } else {
      return res.sendStatus(500);
    }
    return res.sendStatus(200);
  })();
});

export default sharepoint;
