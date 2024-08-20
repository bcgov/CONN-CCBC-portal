/**
 * @jest-environment node
 */
import { mocked } from 'jest-mock';
import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import request from 'supertest';
import crypto from 'crypto';
import { performQuery } from '../../../backend/lib/graphql';
import getAuthRole from '../../../utils/getAuthRole';
import validation from '../../../backend/lib/validation';

jest.mock('../../../backend/lib/graphql');
jest.mock('../../../utils/getAuthRole');
jest.setTimeout(10000);

describe('validation', () => {
  let app;

  beforeEach(async () => {
    app = express();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(session({ secret: crypto.randomUUID(), cookie: { secure: true } }));
    app.use('/', validation);
  });

  it('should receive the correct response for unauthorized user', async () => {
    mocked(getAuthRole).mockImplementation(() => {
      return {
        pgRole: 'ccbc_guest',
        landingRoute: '/',
      };
    });

    const response = await request(app).post(
      '/api/validation/project-number-unique'
    );
    expect(response.status).toBe(404);
  });

  it('should return true if project number is unique', async () => {
    mocked(getAuthRole).mockImplementation(() => {
      return {
        pgRole: 'cbc_admin',
        landingRoute: '/',
      };
    });

    mocked(performQuery).mockImplementation(async () => {
      return {
        data: {
          cbcByProjectNumber: null,
        },
      };
    });

    const response = await request(app)
      .post('/api/validation/project-number-unique')
      .send({ projectNumber: 123 });
    expect(response.body).toBe(true);
  });

  it('should return false if project number is not unique', async () => {
    mocked(getAuthRole).mockImplementation(() => {
      return {
        pgRole: 'cbc_admin',
        landingRoute: '/',
      };
    });

    mocked(performQuery).mockImplementation(async () => {
      return {
        data: {
          cbcByProjectNumber: {
            rowId: 1,
            projectNumber: 123,
          },
        },
      };
    });

    const response = await request(app)
      .post('/api/validation/project-number-unique')
      .send({ projectNumber: 123 });
    expect(response.body).toBe(false);
  });
});
