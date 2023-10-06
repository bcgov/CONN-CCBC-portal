/**
 * @jest-environment node
 */
import { mocked } from 'jest-mock';
import request from 'supertest';
import express from 'express';
import session from 'express-session';
import crypto from 'crypto';
import bodyParser from 'body-parser';
import * as XLSX from 'xlsx';
import * as spauth from '@bcgov-ccbc/ccbc-node-sp-auth';
import decodeJwt from 'utils/decodeJwt';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as openid from 'openid-client';
import { performQuery } from '../../../backend/lib/graphql';
import sharepoint from '../../../backend/lib/sharepoint';
import getAuthRole from '../../../utils/getAuthRole';

jest.mock('../../../utils/getAuthRole');
jest.mock('@bcgov-ccbc/ccbc-node-sp-auth');
jest.mock('../../../backend/lib/graphql');
jest.mock('xlsx');
jest.mock('utils/decodeJwt');
jest.mock('openid-client');

jest.setTimeout(10000);

describe('The SharePoint API', () => {
  let app;

  beforeEach(async () => {
    app = express();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(session({ secret: crypto.randomUUID(), cookie: { secure: true } }));
    app.use('/', sharepoint);
  });

  it('should receive the correct response for unauthorized user', async () => {
    mocked(getAuthRole).mockImplementation(() => {
      return {
        pgRole: 'ccbc_guest',
        landingRoute: '/',
      };
    });

    const response = await request(app).get('/api/sharepoint/cbc-project');
    expect(response.status).toBe(404);

    (decodeJwt as jest.Mock).mockReturnValue({
      header: { alg: 'HS256', typ: 'JWT' },
      payload: { userId: 123, username: 'test_unauthorized' },
      signature: 'mockedSignature',
    });

    const saResponse = await request(app)
      .get('/api/sharepoint/cron-cbc-project')
      .set('Authorization', 'Bearer fake_token');
    expect(saResponse.status).toBe(401);
  });

  it('should return 200 for an ok response', async () => {
    // @ts-ignore
    (spauth.getAuth as jest.Mock).mockResolvedValue({
      headers: {
        Accept: 'application/json;odata=verbose',
        'Content-Type': 'application/json',
      },
    });

    const fakeSummary = [
      {
        A: 20230427,
        B: 'Step 1',
        C: 'Project Information',
        D: 'Complete',
        E: 'Complete',
      },
      {
        A: 20230427,
        B: 'Step 1',
        C: 'Project Information',
        D: 'Complete',
        E: 'Complete',
      },
    ];

    jest.spyOn(XLSX, 'read').mockReturnValue({
      Sheets: { Sheet1: {} },
      SheetNames: ['CBC Projects'],
    });

    jest.spyOn(XLSX.utils, 'sheet_to_json').mockReturnValue(fakeSummary);

    // @ts-ignore
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => {},
        arrayBuffer: async () => new ArrayBuffer(0),
      })
    );

    mocked(performQuery).mockImplementation(async () => {
      return {};
    });

    mocked(getAuthRole).mockImplementation(() => {
      return {
        pgRole: 'ccbc_admin',
        landingRoute: '/',
      };
    });

    const response = await request(app).get('/api/sharepoint/cbc-project');

    // const originalModule = jest.requireActual('openid-client');
    // const issuer = await originalModule.Issuer.discover(
    //   'https://dev.loginproxy.gov.bc.ca/auth/realms/standard'
    // );

    // jest.spyOn(openid.Issuer, 'discover').mockResolvedValue(issuer);

    // const saResponse = await request(app)
    //   .get('/api/sharepoint/cron-cbc-project')
    //   .set('Authorization', 'Bearer test_fake_token');
    expect(response.status).toBe(200);
    // expect(saResponse.status).toBe(200);
  });

  it('should return 400 when the sheet is not found', async () => {
    // @ts-ignore
    (spauth.getAuth as jest.Mock).mockResolvedValue({
      headers: {
        Accept: 'application/json;odata=verbose',
        'Content-Type': 'application/json',
      },
    });

    jest.spyOn(XLSX, 'read').mockReturnValue({
      Sheets: { Sheet1: {} },
      SheetNames: ['Wrong sheet name'],
    });

    mocked(getAuthRole).mockImplementation(() => {
      return {
        pgRole: 'ccbc_admin',
        landingRoute: '/',
      };
    });

    const response = await request(app).get('/api/sharepoint/cbc-project');
    expect(response.status).toBe(400);
    expect(response.body).toEqual([
      {
        error:
          'missing required sheet "CBC Projects". Found: ["Wrong sheet name"]',
        level: 'workbook',
      },
    ]);
  });

  it('should return 500 for when sharepoint fails to respond', async () => {
    (spauth.getAuth as jest.Mock).mockResolvedValue({
      headers: {
        Accept: 'application/json;odata=verbose',
        'Content-Type': 'application/json',
      },
    });
    // @ts-ignore
    global.fetch = jest.fn(() =>
      Promise.resolve({ status: 400, json: () => {} })
    );

    mocked(getAuthRole).mockImplementation(() => {
      return {
        pgRole: 'ccbc_admin',
        landingRoute: '/',
      };
    });

    const response = await request(app).get('/api/sharepoint/cbc-project');
    expect(response.status).toBe(500);
  });
});
