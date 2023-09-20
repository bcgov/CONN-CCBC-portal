/**
 * @jest-environment node
 */
import { mocked } from 'jest-mock';
import request from 'supertest';
import express from 'express';
import session from 'express-session';
import crypto from 'crypto';
import bodyParser from 'body-parser';
import * as spauth from 'node-sp-auth';
import sharepoint from '../../../backend/lib/sharepoint';
import getAuthRole from '../../../utils/getAuthRole';

jest.mock('../../../utils/getAuthRole');
jest.mock('node-sp-auth');

jest.setTimeout(10000000);

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

    const response = await request(app).get(
      '/api/sharepoint/masterSpreadsheet'
    );
    expect(response.status).toBe(404);
  });

  it('should return 200 for an ok response', async () => {
    // @ts-ignore
    (spauth.getAuth as jest.Mock).mockResolvedValue({
      headers: {
        Accept: 'application/json;odata=verbose',
        'Content-Type': 'application/json',
      },
    });
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => {},
        arrayBuffer: async () => new ArrayBuffer(0),
      })
    );

    mocked(getAuthRole).mockImplementation(() => {
      return {
        pgRole: 'ccbc_admin',
        landingRoute: '/',
      };
    });

    const response = await request(app).get(
      '/api/sharepoint/masterSpreadsheet'
    );
    expect(response.status).toBe(200);
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

    const response = await request(app).get(
      '/api/sharepoint/masterSpreadsheet'
    );
    expect(response.status).toBe(500);
  });
});
