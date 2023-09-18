/**
 * @jest-environment node
 */
import request from 'supertest';
import express from 'express';
import session from 'express-session';
import crypto from 'crypto';
import bodyParser from 'body-parser';
import sharepoint from '../../../backend/lib/sharepoint';

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

  it('should return 200 for an ok response', async () => {
    // @ts-ignore
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => {},
        arrayBuffer: async () => new ArrayBuffer(0),
      })
    );

    const response = await request(app).get(
      '/api/sharepoint/masterSpreadsheet'
    );
    expect(response.status).toBe(200);
  });

  it('should return 500 for when sharepoint fails to respond', async () => {
    // @ts-ignore
    global.fetch = jest.fn(() =>
      Promise.resolve({ status: 400, json: () => {} })
    );

    const response = await request(app).get(
      '/api/sharepoint/masterSpreadsheet'
    );
    expect(response.status).toBe(500);
  });
});
