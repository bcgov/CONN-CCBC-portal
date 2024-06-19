import { Router } from 'express';
import * as XLSX from 'xlsx';
import * as spauth from '@bcgov-ccbc/ccbc-node-sp-auth';
import * as luxon from 'luxon';
import config from '../../config';
import getAuthRole from '../../utils/getAuthRole';
import LoadCbcProjectData from './excel_import/cbc_project';
import validateKeycloakToken from './keycloakValidate';
import { performQuery } from './graphql';
import LoadCommunitiesSourceData from './excel_import/communities_source_data';

const SP_SITE = config.get('SP_SITE');
const SP_DOC_LIBRARY = config.get('SP_DOC_LIBRARY');
const SP_FILE_NAME = config.get('SP_MS_FILE_NAME');
const SP_SA_USER = config.get('SP_SA_USER');
const SP_SA_PASSWORD = config.get('SP_SA_PASSWORD');
const SP_LIST_NAME = config.get('SP_LIST_NAME');

const latestTimestampQuery = `
  query LatestTimestampQuery {
    allCbcProjects(filter: {archivedAt: {isNull: true}}, last: 1) {
      nodes {
        sharepointTimestamp
        rowId
      }
    }
  }
`;

const importSharePointData = async (req, res) => {
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
        headers['Content-Type'] = 'application/json;odata=verbose';
        return headers;
      });

    const postErrorList = async (body) => {
      const sharepointErrorList = await fetch(
        `${SP_SITE}/_api/web/lists/GetByTitle('${SP_LIST_NAME}')/items`,
        {
          method: 'POST',
          headers: authHeaders,
          body,
        }
      );
      return sharepointErrorList;
    };

    const metadata = (await fetch(
      `${SP_SITE}/_api/web/GetFolderByServerRelativeUrl('${SP_DOC_LIBRARY}')/Files('${SP_FILE_NAME}')
    `,
      {
        method: 'GET',
        headers: authHeaders,
      }
    )) as any;

    const metadataJson = await metadata.json();

    const latestTimestampQueryResult = (await performQuery(
      latestTimestampQuery,
      {},
      req
    ).catch((e) => {
      return { error: e };
    })) as any;

    const latestTimestamp =
      latestTimestampQueryResult?.data?.allCbcProjects?.nodes[0]
        ?.sharepointTimestamp || null;

    // not the first import
    // check if the file has been modified since the last import
    if (latestTimestamp !== null) {
      if (
        luxon.DateTime.fromISO(latestTimestamp) >=
        luxon.DateTime.fromISO(metadataJson?.d?.TimeLastModified)
      ) {
        // file has not been modified send back 200 with message
        return res.status(200).send({ message: 'No new data to import' }).end();
      }
    }

    const file = await fetch(
      `${SP_SITE}/_api/web/GetFolderByServerRelativeUrl('${SP_DOC_LIBRARY}')/Files('${SP_FILE_NAME}')/$value
    `,
      {
        method: 'GET',
        headers: authHeaders,
      }
    );

    // fetch the list to get the ListItemEntityTypeFullName
    const list = await fetch(
      `${SP_SITE}/_api/web/lists/GetByTitle('${SP_LIST_NAME}')?$select=ListItemEntityTypeFullName`,
      {
        method: 'GET',
        headers: authHeaders,
      }
    );

    // fetch the request digest needed for to POST to sharepoint API
    const digest = await fetch(`${SP_SITE}/_api/contextinfo`, {
      method: 'POST',
      headers: authHeaders,
    });

    const sharepointListJson = await list.json();
    const sharepointTimestamp = metadataJson?.d?.TimeLastModified;
    const listItemEntityTypeFullName =
      sharepointListJson?.d?.ListItemEntityTypeFullName;
    const digestJson = await digest.json();

    // add the request digest to the authHeaders
    authHeaders['X-RequestDigest'] =
      digestJson.d.GetContextWebInformation.FormDigestValue;

    if (!metadata.ok || !file.ok) {
      const body = JSON.stringify({
        __metadata: {
          type: listItemEntityTypeFullName,
        },
        Error: 'Import abandoned',
        Details: 'Could not find the file to import',
      });
      authHeaders['Content-Length'] = body.length;

      const errorlist = await postErrorList(body);
      const errorlistJson = await errorlist.json();
      return res.status(500).json(errorlistJson).end();
    }

    if (metadata.ok && file.ok) {
      const bufferResponse = await file.arrayBuffer();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const wb = XLSX.read(bufferResponse);
      const sheet = 'CBC Projects';
      const communitiesDataSheet = 'Communities Source Data';
      const projectCommunitiesDataSheet = 'CBC & CCBC Project Communities';
      // Throw error if sheet is not found
      if (!wb.SheetNames.includes(sheet)) {
        errorList.push({
          level: 'workbook',
          error: `missing required sheet "${sheet}". Found: ${JSON.stringify(
            wb.SheetNames
          )}`,
        });
      }

      if (!wb.SheetNames.includes(communitiesDataSheet)) {
        errorList.push({
          level: 'workbook',
          error: `missing required sheet "${communitiesDataSheet}". Found: ${JSON.stringify(
            wb.SheetNames
          )}`,
        });
      }

      if (!wb.SheetNames.includes(projectCommunitiesDataSheet)) {
        errorList.push({
          level: 'workbook',
          error: `missing required sheet "${projectCommunitiesDataSheet}". Found: ${JSON.stringify(
            wb.SheetNames
          )}`,
        });
      }

      if (errorList.length > 0) {
        const body = JSON.stringify({
          __metadata: {
            type: listItemEntityTypeFullName,
          },
          Error: 'Import abandoned',
          Details: errorList.map((e) => e.error).join('\n'),
        });
        authHeaders['Content-Length'] = body.length;

        const errorlist = await postErrorList(body);
        const errorlistJson = await errorlist.json();

        return res.status(400).json(errorlistJson).end();
      }

      // Loading communities source data to the db
      const communitiesSourceDataResult = await LoadCommunitiesSourceData(
        wb,
        communitiesDataSheet,
        req
      );

      const result = await LoadCbcProjectData(
        wb,
        sheet,
        projectCommunitiesDataSheet,
        sharepointTimestamp,
        req
      );

      if (result['errorLog']?.length > 0) {
        const body = JSON.stringify({
          __metadata: {
            type: listItemEntityTypeFullName,
          },
          Error: 'Imported with errors',
          Details: result['errorLog'].join('\n'),
        });
        authHeaders['Content-Length'] = body.length;

        const errorlist = await postErrorList(body);

        // Status 200 is returned since we still imported the data
        return res.status(200).json(errorlist).end();
      }

      if (result['error']?.length > 0) {
        const body = JSON.stringify({
          __metadata: {
            type: listItemEntityTypeFullName,
          },
          Error: 'Import abandoned',
          Details: result['error'].join('\n'),
        });
        authHeaders['Content-Length'] = body.length;

        const errors = await postErrorList(body);
        const errorsJson = await errors.json();

        return res.status(400).json(errorsJson).end();
      }

      if (result) {
        return res
          .status(200)
          .json({
            result,
            communitiesSourceDataResult,
          })
          .end();
      }
    } else {
      return res.sendStatus(500);
    }
    return res.sendStatus(200);
  })();
};

const sharepoint = Router();

// eslint-disable-next-line consistent-return
sharepoint.get('/api/sharepoint/cbc-project', (req, res) => {
  const authRole = getAuthRole(req);
  const isRoleAuthorized = authRole?.pgRole === 'ccbc_admin';
  if (!isRoleAuthorized) {
    return res.status(404).end();
  }

  importSharePointData(req, res);
});

sharepoint.get(
  '/api/sharepoint/cron-cbc-project',
  validateKeycloakToken,
  (req, res) => {
    req.claims.identity_provider = 'serviceaccount';
    importSharePointData(req, res);
  }
);

export default sharepoint;
