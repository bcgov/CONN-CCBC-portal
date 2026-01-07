/**
 * @jest-environment node
 */
import { mocked } from 'jest-mock';
import express from 'express';
import session from 'express-session';
import request from 'supertest';
import cbc from '../../../../backend/lib/cbc/cbc';
import { performQuery } from '../../../../backend/lib/graphql';
import getAuthRole from '../../../../utils/getAuthRole';

jest.mock('../../../../utils/getAuthRole');
jest.mock('../../../../backend/lib/graphql');

jest.setTimeout(10000);

describe('The Community Progress Report import', () => {
  let app;

  beforeEach(async () => {
    app = express();
    app.use(session({ secret: crypto.randomUUID(), cookie: { secure: true } }));
    app.use(express.json());
    app.use('/', cbc);
  });

  it('should return 404 if user is not authorized', async () => {
    mocked(getAuthRole).mockReturnValue({
      pgRole: 'analyst',
      landingRoute: '/',
    });
    const response = await request(app)
      .post('/api/cbc')
      .send({
        projectId: 123,
        projectTitle: 'Test Project',
        externalStatus: 'active',
        projectType: 'type1',
      })
      .expect(404);

    expect(response.status).toBe(404);
  });

  it('should create a new CBC project', async () => {
    mocked(getAuthRole).mockReturnValue({
      pgRole: 'cbc_admin',
      landingRoute: '/',
    });
    mocked(performQuery).mockResolvedValue({
      data: {
        createCbc: {
          cbc: {
            rowId: 1,
          },
        },
      },
    });

    const response = await request(app)
      .post('/api/cbc')
      .send({
        projectId: '123',
        projectTitle: 'Test Project',
        externalStatus: 'active',
        projectType: 'type1',
      })
      .expect(200);

    expect(response.status).toBe(200);
    expect(response.body.rowId).toBe(1);
  });

  it('should return an error if project ID already exists', async () => {
    mocked(getAuthRole).mockReturnValue({
      pgRole: 'cbc_admin',
      landingRoute: '/',
    });
    mocked(performQuery).mockResolvedValue({
      errors: [
        {
          message:
            'duplicate key value violates unique constraint "cbc_project_number_key"',
          locations: [],
          path: [],
          nodes: [],
          source: null,
          positions: [],
          originalError: undefined,
          extensions: {},
          name: '',
        },
      ],
    });

    const response = await request(app)
      .post('/api/cbc')
      .send({
        projectId: '123',
        projectTitle: 'Test Project',
        externalStatus: 'active',
        projectType: 'type1',
      })
      .expect(200);

    expect(response.status).toBe(200);
    expect(response.body.error[0].message).toContain(
      'duplicate key value violates unique constraint'
    );
  });
});
