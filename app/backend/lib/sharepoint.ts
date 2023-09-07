import { Router } from 'express';
import {
  Client,
  AuthProvider,
  Options,
  AuthProviderCallback,
  ResponseType,
} from '@microsoft/microsoft-graph-client';
import * as XLSX from 'xlsx';

const sharepoint = Router();
const siteId = process.env.SP_SITE_ID || '';
const driveId = process.env.SP_DRIVE_ID || '';
const itemId = process.env.SP_ITEM_ID || '';

// Mock auth
const authProvider: AuthProvider = (callback: AuthProviderCallback) => {
  // Temp mock auth provider
  // TODO: setup actual authentication

  // Error should be passed in case of error while authenticating
  // accessToken should be passed upon successful authentication
  const error = null;
  const accessToken = process.env.MS_GRAPH_TOKEN || '';
  callback(error, accessToken);
};
const options: Options = {
  authProvider,
};

const client = Client.init(options);

sharepoint.get('/api/sharepoint', async (req, res) => {
  const responseObject = { usingXLSX: null, usingGraph: null };
  try {
    // Get the binary data
    const bufferResponse = await client
      .api(`/sites/${siteId}/drives/${driveId}/items/${itemId}/content`)
      .responseType(ResponseType.ARRAYBUFFER)
      .get();
    // console.log(readableResponse);
    const wb = XLSX.read(bufferResponse);
    // console.log(wb);
    responseObject.usingXLSX = wb;
    // parse the binary Response with regular library

    // Alternative method, get values of the used range of a worksheet
    const rangeResponse = await client
      .api(
        `/sites/${siteId}/drives/${driveId}/items/${itemId}/workbook/worksheets('CBC Projects')/usedRange(valuesOnly=true)`
      )
      .get();
    responseObject.usingGraph = rangeResponse;
    // console.log(rangeResponse);
  } catch (e) {
    console.log(e);
  }
  res.json(responseObject).end();
});

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};

export default sharepoint;
