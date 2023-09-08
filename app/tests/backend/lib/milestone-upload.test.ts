/**
 * @jest-environment node
 */
import { mocked } from 'jest-mock';
import request from 'supertest';
import express from 'express';
import session from 'express-session';
import crypto from 'crypto';
import milestoneUpload from '../../../backend/lib/milestone-upload';
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

describe('The Milestone excel import api route', () => {
  let app;

  beforeEach(async () => {
    app = express();
    app.use(session({ secret: crypto.randomUUID(), cookie: { secure: true } }));
    app.use('/', milestoneUpload);
  });

  it('should receive the correct response for unauthorized user', async () => {
    mocked(getAuthRole).mockImplementation(() => {
      return {
        pgRole: 'ccbc_guest',
        landingRoute: '/',
      };
    });

    const response = await request(app).post(
      '/api/analyst/milestone/1/CCBC-010001/1'
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
      .post('/api/analyst/milestone/10/CCBC-010001/1')
      .set('Content-Type', 'application/json')
      .set('Connection', 'keep-alive')
      .field('data', JSON.stringify({ name: 'milestone-data' }))
      // replace with claims file once we receive it
      .attach('claims-data', `${__dirname}/milestone_empty.xlsx`)
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
      .post('/api/analyst/milestone/1/CCBC-010001/1')
      .set('Content-Type', 'application/json')
      .set('Connection', 'keep-alive')
      .field('data', JSON.stringify({ name: 'milestone-data' }))
      .attach('claims-data', `${__dirname}/sow_200.xlsx`)
      .expect(400);

    expect(response.status).toBe(400);
    expect(response.body).toEqual([
      {
        level: 'workbook',
        error: `missing required sheet "Project Updates Centre". Found: ["Summary_Sommaire","1","2","3","4","5","6","7","8","Change Log","Controls","Controls_E","Controls_F","Communities","Text"]`,
      },
      {
        level: 'workbook',
        error: `missing required sheet "Milestone 1". Found: ["Summary_Sommaire","1","2","3","4","5","6","7","8","Change Log","Controls","Controls_E","Controls_F","Communities","Text"]`,
      },
      {
        level: 'workbook',
        error: `missing required sheet "Milestone 2". Found: ["Summary_Sommaire","1","2","3","4","5","6","7","8","Change Log","Controls","Controls_E","Controls_F","Communities","Text"]`,
      },
    ]);
  });

  afterEach(async () => {
    // eslint-disable-next-line no-promise-executor-return
    await new Promise<void>((resolve) => setTimeout(() => resolve(), 500)); // avoid jest open handle error
  });
  jest.resetAllMocks();
});
