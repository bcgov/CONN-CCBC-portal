/**
 * @jest-environment node
 */
import { mocked } from 'jest-mock';
import request from 'supertest';
import express from 'express';
import session from 'express-session';
import crypto from 'crypto';
import claimsUpload from '../../../backend/lib/claims-upload';
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

describe('The Claims excel import api route', () => {
  let app;

  beforeEach(async () => {
    app = express();
    app.use(session({ secret: crypto.randomUUID(), cookie: { secure: true } }));
    app.use('/', claimsUpload);
  });

  it('should receive the correct response for unauthorized user', async () => {
    mocked(getAuthRole).mockImplementation(() => {
      return {
        pgRole: 'ccbc_guest',
        landingRoute: '/',
      };
    });

    const response = await request(app).post(
      '/api/analyst/claims/1/CCBC-010001/1'
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
          createApplicationClaimsData: {
            applicationClaimsData: { rowId: 1 },
          },
        },
      };
    });

    const response = await request(app)
      .post('/api/analyst/claims/10/CCBC-010001/undefined/undefined')
      .set('Content-Type', 'application/json')
      .set('Connection', 'keep-alive')
      .field('data', JSON.stringify({ name: 'claims-data' }))
      // replace with claims file once we receive it
      .attach('claims-data', `${__dirname}/claims.xlsx`)
      .expect(200);

    expect(response.status).toBe(200);
  });

  it('should process uploaded file for new format', async () => {
    mocked(getAuthRole).mockImplementation(() => {
      return {
        pgRole: 'ccbc_admin',
        landingRoute: '/',
      };
    });

    mocked(performQuery).mockImplementation(async () => {
      return {
        data: {
          createApplicationClaimsData: {
            applicationClaimsData: { rowId: 1 },
          },
        },
      };
    });

    const response = await request(app)
      .post('/api/analyst/claims/10/CCBC-010001/undefined/undefined')
      .set('Content-Type', 'application/json')
      .set('Connection', 'keep-alive')
      .field('data', JSON.stringify({ name: 'claims-data' }))
      // replace with claims file once we receive it
      .attach('claims-data', `${__dirname}/claims_new_format.xlsx`)
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

    const response = await request(app)
      .post('/api/analyst/claims/10/CCBC-010001/1/1')
      .set('Content-Type', 'application/json')
      .set('Connection', 'keep-alive')
      .field('data', JSON.stringify({ name: 'claims-data' }))
      .attach('claims-data', `${__dirname}/sow_200.xlsx`)
      .expect(400);

    expect(response.status).toBe(400);
    expect(response.body).toEqual([
      {
        level: 'workbook',
        error: `missing required sheet "Claim Request Form". Found: ["Summary_Sommaire","1","2","3","4","5","6","7","8","Change Log","Controls","Controls_E","Controls_F","Communities","Text"]`,
      },
      {
        level: 'workbook',
        error: `missing required sheet "Progress Report". Found: ["Summary_Sommaire","1","2","3","4","5","6","7","8","Change Log","Controls","Controls_E","Controls_F","Communities","Text"]`,
      },
    ]);
  });

  it('should return correct errors for excel with empty fields', async () => {
    mocked(getAuthRole).mockImplementation(() => {
      return {
        pgRole: 'ccbc_admin',
        landingRoute: '/',
      };
    });

    const response = await request(app)
      .post('/api/analyst/claims/10/CCBC-010001/undefined/undefined')
      .set('Content-Type', 'application/json')
      .set('Connection', 'keep-alive')
      .field('data', JSON.stringify({ name: 'claims-data' }))
      .attach('claims-data', `${__dirname}/claims_empty.xlsx`)
      .expect(400);

    expect(response.status).toBe(400);
    expect(response.body).toEqual([
      {
        error: 'Invalid data: Claim number',
        level: 'cell',
      },
      { level: 'cell', error: 'Invalid data: Date request received' },
      {
        level: 'cell',
        error: 'Invalid data: Eligible costs incurred from date',
      },
      {
        level: 'cell',
        error: 'Invalid data: Eligible costs incurred to date',
      },
      {
        error:
          'CCBC Number mismatch: expected CCBC-010001, received: undefined',
      },
    ]);
  });

  it('should return correct errors for excel with empty fields for new format', async () => {
    mocked(getAuthRole).mockImplementation(() => {
      return {
        pgRole: 'ccbc_admin',
        landingRoute: '/',
      };
    });

    const response = await request(app)
      .post('/api/analyst/claims/10/CCBC-010001/undefined/undefined')
      .set('Content-Type', 'application/json')
      .set('Connection', 'keep-alive')
      .field('data', JSON.stringify({ name: 'claims-data' }))
      .attach('claims-data', `${__dirname}/claims_new_format_empty.xlsx`)
      .expect(400);

    expect(response.status).toBe(400);
    expect(response.body).toEqual([
      {
        error: 'Invalid data: Claim number',
        level: 'cell',
      },
      { level: 'cell', error: 'Invalid data: Date request received' },
      {
        level: 'cell',
        error: 'Invalid data: Eligible costs incurred from date',
      },
      {
        level: 'cell',
        error: 'Invalid data: Eligible costs incurred to date',
      },
      {
        error:
          'CCBC Number mismatch: expected CCBC-010001, received: undefined',
      },
    ]);
  });

  it('should return correct errors for excel with incorrect fields', async () => {
    mocked(getAuthRole).mockImplementation(() => {
      return {
        pgRole: 'ccbc_admin',
        landingRoute: '/',
      };
    });

    const response = await request(app)
      .post('/api/analyst/claims/10/CCBC-010001/undefined/undefined')
      .set('Content-Type', 'application/json')
      .set('Connection', 'keep-alive')
      .field('data', JSON.stringify({ name: 'claims-data' }))
      .attach('claims-data', `${__dirname}/claims_validation_errors.xlsx`)
      .expect(400);

    expect(response.status).toBe(400);
    expect(response.body).toEqual([
      {
        error: 'Invalid data: Claim number',
        level: 'cell',
      },
      { level: 'cell', error: 'Invalid data: Date request received' },
      {
        level: 'cell',
        error:
          'Invalid data: Eligible costs incurred from date cannot be greater than eligible costs incurred to date',
      },
      {
        error:
          'CCBC Number mismatch: expected CCBC-010001, received: CCBC-010002',
      },
    ]);
  });

  it('should return correct errors for claim number in use', async () => {
    mocked(getAuthRole).mockImplementation(() => {
      return {
        pgRole: 'ccbc_admin',
        landingRoute: '/',
      };
    });

    mocked(performQuery).mockImplementation(async () => {
      return {
        data: {
          applicationByRowId: {
            applicationClaimsExcelDataByApplicationId: {
              nodes: [
                {
                  jsonData: {
                    claimNumber: 999,
                    projectNumber: 'CCBC-010001',
                    progressOnPermits: 'Not Started',
                    projectBudgetRisks: 'Yes',
                    dateRequestReceived: '2023-01-01',
                    hasConstructionBegun: 'In Progress',
                    projectScheduleRisks: 'Yes',
                    communicationMaterials: 'Yes',
                    changesToOverallBudget: 'Yes',
                    haveServicesBeenOffered: 'Completed',
                    eligibleCostsIncurredToDate: '2023-08-01T00:00:00.000Z',
                    eligibleCostsIncurredFromDate: '2023-08-02T00:00:00.000Z',
                    thirdPartyPassiveInfrastructure: 'Yes',
                  },
                  rowId: 1,
                },
              ],
            },
          },
        },
      };
    });

    const response = await request(app)
      .post('/api/analyst/claims/10/CCBC-010001/undefined/undefined')
      .set('Content-Type', 'application/json')
      .set('Connection', 'keep-alive')
      .field('data', JSON.stringify({ name: 'claims-data' }))
      .attach('claims-data', `${__dirname}/claims.xlsx`)
      .expect(400);

    expect(response.status).toBe(400);
    expect(response.body).toEqual([
      {
        error:
          "Check that it's the correct file and retry uploading. If you were trying to edit an existing claim, please click the edit button beside it.",
        level: 'claimNumber',
      },
    ]);
  });

  it('should return correct errors for claim number not matching edit', async () => {
    mocked(getAuthRole).mockImplementation(() => {
      return {
        pgRole: 'ccbc_admin',
        landingRoute: '/',
      };
    });

    mocked(performQuery).mockImplementation(async () => {
      return {
        data: {
          applicationByRowId: {
            applicationClaimsExcelDataByApplicationId: {
              nodes: [
                {
                  jsonData: {
                    claimNumber: 998,
                    projectNumber: 'CCBC-010001',
                    progressOnPermits: 'Not Started',
                    projectBudgetRisks: 'Yes',
                    dateRequestReceived: '2023-01-01',
                    hasConstructionBegun: 'In Progress',
                    projectScheduleRisks: 'Yes',
                    communicationMaterials: 'Yes',
                    changesToOverallBudget: 'Yes',
                    haveServicesBeenOffered: 'Completed',
                    eligibleCostsIncurredToDate: '2023-08-01T00:00:00.000Z',
                    eligibleCostsIncurredFromDate: '2023-08-02T00:00:00.000Z',
                    thirdPartyPassiveInfrastructure: 'Yes',
                  },
                  rowId: 1,
                },
              ],
            },
          },
        },
      };
    });

    const response = await request(app)
      .post('/api/analyst/claims/10/CCBC-010001/1/1')
      .set('Content-Type', 'application/json')
      .set('Connection', 'keep-alive')
      .field('data', JSON.stringify({ name: 'claims-data' }))
      .attach('claims-data', `${__dirname}/claims.xlsx`)
      .expect(400);

    expect(response.status).toBe(400);
    expect(response.body).toEqual([
      {
        error: 'The claim number does not match the claim number being edited.',
      },
    ]);
  });

  afterEach(async () => {
    // eslint-disable-next-line no-promise-executor-return
    await new Promise<void>((resolve) => setTimeout(() => resolve(), 500)); // avoid jest open handle error
  });
  jest.resetAllMocks();
});
