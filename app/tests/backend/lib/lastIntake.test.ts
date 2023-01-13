/**
 * @jest-environment node
 */
import { mocked } from 'jest-mock';
import request from 'supertest';
import express from 'express';
import session from 'express-session';
import crypto from 'crypto';
import getLastIntakeId from '../../../backend/lib/lastIntake';
import { performQuery } from '../../../backend/lib/graphql';
import getAuthRole from '../../../utils/getAuthRole';

jest.mock('../../../backend/lib/graphql');
jest.mock('../../../utils/getAuthRole');

describe('Get Last Intake', () => {
  let app;
  const fake = (req,res,next) => {
    next(req,res);
  }
  beforeEach(async () => { 
    app = express();
    app.use(session({ secret: crypto.randomUUID(), cookie: { secure: true } }));
    app.use('/',fake);
  });

  it('should produce correct intake id', async () => {
    mocked(getAuthRole).mockImplementation(() => {
      return {
        pgRole: 'ccbc_admin',
        landingRoute: '/',
      };
    });

    mocked(performQuery).mockImplementation(async () => {
      return {
        data: {
          allIntakes: {
            nodes: [
              {
                "closeTimestamp": "2022-11-06T09:00:00-08:00",
                "rowId": 1
              },
              {
                "closeTimestamp": "2090-11-06T09:00:00-08:00",
                "rowId": 3
              },
              {
                "closeTimestamp": "2023-01-06T09:00:00-08:00",
                "rowId": 2
              }
            ],
          },
        },
      };
    });
 
    const response = await getLastIntakeId(request);
    expect(response).toBe(2);
  });

  it('should not throw error if no intakes matched', async () => {
    mocked(getAuthRole).mockImplementation(() => {
      return {
        pgRole: 'ccbc_admin',
        landingRoute: '/',
      };
    });

    mocked(performQuery).mockImplementation(async () => {
      return {
        data: {
          allIntakes: {
            nodes: [
              {
                "closeTimestamp": "2023-11-06T09:00:00-08:00",
                "rowId": 1
              }
            ],
          },
        },
      };
    });
 
    const response = await getLastIntakeId(request);
    expect(response).toBe(-1);
  });

  jest.resetAllMocks();
});
