/**
 * @jest-environment node
 */
import { mocked } from 'jest-mock';
import request from 'supertest';
import express from 'express';
import session from 'express-session';
import crypto from 'crypto';
import sowUpload from '../../../backend/lib/sow-upload';
import { performQuery } from '../../../backend/lib/graphql';
import getAuthRole from '../../../utils/getAuthRole';

jest.mock('../../../backend/lib/graphql');
jest.mock('../../../utils/getAuthRole');

function FormDataMock() {
  this.append = jest.fn();
}

global.FormData = jest.fn(() => {
    return FormDataMock();
  }
) as jest.Mock;

jest.setTimeout(100000);

describe('The SoW import', () => {
  let app;

  beforeEach(async () => {
    app = express();
    app.use(session({ secret: crypto.randomUUID(), cookie: { secure: true } }));
    app.use('/', sowUpload);
  });

  it('should receive the correct response for unauthorized user', async () => {
    mocked(getAuthRole).mockImplementation(() => {
      return {
        pgRole: 'ccbc_guest',
        landingRoute: '/',
      };
    });

    const response = await request(app).post('/api/analyst/sow');
    expect(response.status).toBe(404);
  });

  it('should process uploaded file for authorized user', async () => {
    mocked(getAuthRole).mockImplementation(() => {
      return {
        pgRole: 'ccbc_admin',
        landingRoute: '/',
      };
    });

    mocked(performQuery).mockImplementation(async () => {
      return {
        data: { createApplicationSowData: { applicationSowData: {rowId:1}}}
      };
    });
    const payload = { applicationId: 10, ccbcNumber: 'CCBC-010008'};
    const response = await request(app)
      .post('/api/analyst/sow') 
      .send(payload)
      .set("Content-Type", "application/json")
      .set('Connection', 'keep-alive')
      .field("data", JSON.stringify({ name: "sow-data" }))
      .attach("sow-data", `${__dirname}/sow_200.xlsx`)
      .expect(200);
 
    expect(response.status).toBe(200);
  });

  it('should return error if file does not have expected worksheets', async () => {
    mocked(getAuthRole).mockImplementation(() => {
      return {
        pgRole: 'ccbc_admin',
        landingRoute: '/',
      };
    });

    const payload = { applicationId: 10, ccbcNumber: 'CCBC-010008'};
    const response = await request(app)
      .post('/api/analyst/sow') 
      .send(payload)
      .set("Content-Type", "application/json")
      .set('Connection', 'keep-alive')
      .field("data", JSON.stringify({ name: "sow-data" }))
      .attach("sow-data", `${__dirname}/sow_400.xlsx`)
      .expect(400);

    expect(response.status).toBe(400); 
  });

  jest.resetAllMocks();
});
