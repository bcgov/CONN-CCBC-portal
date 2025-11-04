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
}) as jest.Mock;

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

    const response = await request(app).post(
      '/api/analyst/sow/1/CCBC-010010/0'
    );
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
        data: {
          createApplicationSowData: { applicationSowData: { rowId: 1 } },
        },
      };
    });

    const response = await request(app)
      .post('/api/analyst/sow/10/CCBC-020118/0')
      .set('Content-Type', 'application/json')
      .set('Connection', 'keep-alive')
      .field('data', JSON.stringify({ name: 'sow-data' }))
      .attach('sow-data', `${__dirname}/sow_200.xlsx`)
      .expect(200);

    expect(response.status).toBe(200);
  });

  it('should validate uploaded file for authorized user', async () => {
    mocked(getAuthRole).mockImplementation(() => {
      return {
        pgRole: 'ccbc_admin',
        landingRoute: '/',
      };
    });

    mocked(performQuery).mockImplementation(async () => {
      return {
        data: {
          createApplicationSowData: { applicationSowData: { rowId: 1 } },
        },
      };
    });

    const response = await request(app)
      .post('/api/analyst/sow/10/CCBC-020118/0?validate=true')
      .set('Content-Type', 'application/json')
      .set('Connection', 'keep-alive')
      .field('data', JSON.stringify({ name: 'sow-data' }))
      .attach('sow-data', `${__dirname}/sow_200.xlsx`)
      .expect(200);

    expect(response.status).toBe(200);

    expect(performQuery).not.toHaveBeenCalled();
  });

  it('should return error if file does not have expected worksheets', async () => {
    mocked(getAuthRole).mockImplementation(() => {
      return {
        pgRole: 'ccbc_admin',
        landingRoute: '/',
      };
    });

    const response = await request(app)
      .post('/api/analyst/sow/10/CCBC-010010/0')
      .set('Content-Type', 'application/json')
      .set('Connection', 'keep-alive')
      .field('data', JSON.stringify({ name: 'sow-data' }))
      .attach('sow-data', `${__dirname}/sow_400.xlsx`)
      .expect(400);

    expect(response.status).toBe(400);
    expect(response.body).toEqual([
      {
        level: 'workbook',
        error: 'missing required sheet "Summary_Sommaire". Found: ["Sheet1"]',
      },
      {
        level: 'workbook',
        error: 'missing required sheet "1". Found: ["Sheet1"]',
      },
      {
        level: 'workbook',
        error: 'missing required sheet "2". Found: ["Sheet1"]',
      },
      {
        level: 'workbook',
        error: 'missing required sheet "7". Found: ["Sheet1"]',
      },
      {
        level: 'workbook',
        error: 'missing required sheet "8". Found: ["Sheet1"]',
      },
    ]);
  });

  it('should return error if ccbc_number in file does not match request', async () => {
    mocked(getAuthRole).mockImplementation(() => {
      return {
        pgRole: 'ccbc_admin',
        landingRoute: '/',
      };
    });

    mocked(performQuery).mockImplementation(async () => {
      return {
        data: {
          createApplicationSowData: { applicationSowData: { rowId: 1 } },
        },
      };
    });

    const response = await request(app)
      .post('/api/analyst/sow/10/CCBC-020100/0')
      .set('Content-Type', 'application/json')
      .set('Connection', 'keep-alive')
      .field('data', JSON.stringify({ name: 'sow-data' }))
      .attach('sow-data', `${__dirname}/sow_200.xlsx`)
      .expect(400);

    expect(response.status).toBe(400);
    expect(response.body).toEqual([
      {
        level: 'summary',
        error: [
          {
            cell: 'D10',
            error: 'CCBC Number mismatch',
            expected: 'CCBC-020100',
            received: 'CCBC-020118',
          },
        ],
      },
    ]);
  });

  afterEach(async () => {
    // eslint-disable-next-line no-promise-executor-return
    await new Promise<void>((resolve) => setTimeout(() => resolve(), 500)); // avoid jest open handle error
  });
  jest.resetAllMocks();
});
