/**
 * @jest-environment node
 */
import { mocked } from 'jest-mock';
import request from 'supertest';
import express from 'express';
import session from 'express-session';
import crypto from 'crypto';
import gisUpload from '../../../backend/lib/gis-upload';
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

jest.setTimeout(1000);

describe('The GIS import', () => {
  let app;

  beforeEach(async () => {
    app = express();
    app.use(session({ secret: crypto.randomUUID(), cookie: { secure: true } }));
    app.use('/', gisUpload);
  });

  it('should receive the correct response for unauthorized user', async () => {
    mocked(getAuthRole).mockImplementation(() => {
      return {
        pgRole: 'ccbc_guest',
        landingRoute: '/',
      };
    });

    const response = await request(app).post('/api/analyst/gis');
    expect(response.status).toBe(404);
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
        data: { createGisData: { gisData: { rowId: 1 } } },
      };
    });

    const response = await request(app)
      .post('/api/analyst/gis')
      .set('Content-Type', 'application/json')
      .set('Connection', 'keep-alive')
      .field('data', JSON.stringify({ name: 'gis-data' }))
      .attach('gis-data', `${__dirname}/gis-data-200.json`)
      .expect(200);

    expect(response.status).toBe(200);
  });

  it('should return validation error if file fails basic eslint check', async () => {
    mocked(getAuthRole).mockImplementation(() => {
      return {
        pgRole: 'ccbc_admin',
        landingRoute: '/',
      };
    });

    mocked(performQuery).mockImplementation(async () => {
      return {
        data: { createGisData: { gisData: { rowId: 1 } } },
      };
    });
    const expected = {
      errors: [
        {
          line: 1,
          message: 'must be array',
          ccbc_number: null,
        },
      ],
    };

    const response = await request(app)
      .post('/api/analyst/gis')
      .set('Content-Type', 'application/json')
      .set('Connection', 'keep-alive')
      .field('data', JSON.stringify({ name: 'gis-data' }))
      .attach('gis-data', `${__dirname}/gis-data-400a.json`)
      .expect(400);
    expect(response.status).toBe(400);
    expect(response.body).toEqual(expected);
  });

  it('should return validation error if file fails complex eslint check', async () => {
    mocked(getAuthRole).mockImplementation(() => {
      return {
        pgRole: 'ccbc_admin',
        landingRoute: '/',
      };
    });

    mocked(performQuery).mockImplementation(async () => {
      return {
        data: { createGisData: { gisData: { rowId: 1 } } },
      };
    });

    const expected = {
      errors: [
        {
          line: 10,
          position: 26,
          message: 'Value expected',
        },
        {
          line: 5,
          position: 20,
          message: 'Expected comma',
        },
        {
          line: 2,
          position: 17,
          message: 'Value expected',
        },
      ],
    };

    const response = await request(app)
      .post('/api/analyst/gis')
      .set('Content-Type', 'application/json')
      .set('Connection', 'keep-alive')
      .field('data', JSON.stringify({ name: 'gis-data' }))
      .attach('gis-data', `${__dirname}/gis-data-400b.json`)
      .expect(400);
    expect(response.status).toBe(400);
    expect(response.body).toEqual(expected);
  });

  it('should return validation error if file does not match schema', async () => {
    mocked(getAuthRole).mockImplementation(() => {
      return {
        pgRole: 'ccbc_admin',
        landingRoute: '/',
      };
    });

    mocked(performQuery).mockImplementation(async () => {
      return {
        data: { createGisData: { gisData: { rowId: 1 } } },
      };
    });

    const response = await request(app)
      .post('/api/analyst/gis')
      .set('Content-Type', 'application/json')
      .set('Connection', 'keep-alive')
      .field('data', JSON.stringify({ name: 'gis-data' }))
      .attach('gis-data', `${__dirname}/gis-data-400.json`)
      .expect(400);

    expect(response.status).toBe(400);
  });

  it('should return details about validation errors', async () => {
    mocked(getAuthRole).mockImplementation(() => {
      return {
        pgRole: 'ccbc_admin',
        landingRoute: '/',
      };
    });

    mocked(performQuery).mockImplementation(async () => {
      return {
        data: { createGisData: { gisData: { rowId: 1 } } },
      };
    });

    const response = await request(app)
      .post('/api/analyst/gis')
      .set('Content-Type', 'application/json')
      .set('Connection', 'keep-alive')
      .field('data', JSON.stringify({ name: 'gis-data' }))
      .attach('gis-data', `${__dirname}/gis-data-errors.json`)
      .expect(400);

    expect(response.status).toBe(400);

    const { errors } = response.body;
    expect(errors).toBeTruthy();

    expect(errors.length).toBe(2);
    const first = errors[0];
    expect(first.line).toBe(6);
    expect(first.ccbc_number).toBe('CCBC-010001');
    expect(first.message).toBe('GIS_TOTAL_HH must be number');
  });

  jest.resetAllMocks();
});
