/**
 * @jest-environment node
 */
import request from 'supertest';
import express from 'express';
import { mocked } from 'jest-mock';
import intake from '../../../backend/lib/intake';
import getAuthRole from '../../../utils/getAuthRole';
import { performQuery } from '../../../backend/lib/graphql';

jest.mock('../../../backend/lib/graphql');
jest.mock('../../../utils/getAuthRole');

const app = express();
app.use(express.json());
app.use(intake);

const mockCurrentIntakeQuery = {
  data: {
    openIntake: {
      ccbcIntakeNumber: 1,
      hiddenCode: 'testcode',
      rowId: 1,
    },
    session: {
      ccbcUserBySub: {
        rowId: 1,
        sessionSub: 'testsub',
        intakeUsersByUserId: {
          nodes: [],
        },
      },
    },
  },
};

const mockIntakeUserMutation = {
  data: {
    createIntakeUser: {
      clientMutationId: 'test',
    },
  },
};

describe('GET /api/intake', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 if required query parameters are missing', async () => {
    const res = await request(app).get('/api/intake');
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Missing required query parameters');
  });

  it('should return 400 if code is invalid and user is logged in', async () => {
    mocked(getAuthRole).mockImplementation(() => {
      return {
        pgRole: 'ccbc_auth_user',
        landingRoute: '/',
      };
    });

    (performQuery as jest.Mock).mockResolvedValueOnce(mockCurrentIntakeQuery);

    const res = await request(app)
      .get('/api/intake')
      .query({ code: 'wrongcode' });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Invalid');
  });

  it('should redirect to dashboard if user is already on the table', async () => {
    const mockCurrentIntakeQueryWithUser = {
      ...mockCurrentIntakeQuery,
      data: {
        ...mockCurrentIntakeQuery.data,
        session: {
          ...mockCurrentIntakeQuery.data.session,
          ccbcUserBySub: {
            ...mockCurrentIntakeQuery.data.session.ccbcUserBySub,
            intakeUsersByUserId: {
              nodes: [{ intakeId: 1 }],
            },
          },
        },
      },
    };

    (performQuery as jest.Mock).mockResolvedValueOnce(
      mockCurrentIntakeQueryWithUser
    );

    const res = await request(app)
      .get('/api/intake')
      .query({ code: 'testcode', intake: '1' });
    expect(res.status).toBe(302);
    expect(res.header.location).toBe('/applicantportal/dashboard');
  });

  it('should create intake user and redirect to dashboard', async () => {
    (performQuery as jest.Mock)
      .mockResolvedValueOnce(mockCurrentIntakeQuery)
      .mockResolvedValueOnce(mockIntakeUserMutation);

    const res = await request(app)
      .get('/api/intake')
      .query({ code: 'testcode' });
    expect(res.status).toBe(302);
    expect(res.header.location).toBe('/applicantportal/dashboard');
  });

  it('should return 500 if an error occurs', async () => {
    (performQuery as jest.Mock).mockRejectedValueOnce(new Error('Test error'));

    const res = await request(app)
      .get('/api/intake')
      .query({ code: 'testcode' });
    expect(res.status).toBe(500);
    expect(res.body.error).toBe(
      'An error has occurred, please try again later. If the error persists please contact us. '
    );
  });

  it('should redirect to applicant portal with code as redirect if user is not logged in', async () => {
    mocked(getAuthRole).mockImplementation(() => {
      return {
        pgRole: 'ccbc_guest',
        landingRoute: '/',
      };
    });

    const res = await request(app)
      .get('/api/intake')
      .query({ code: 'testcode' });
    expect(res.status).toBe(302);
    expect(res.header.location).toBe(
      '/applicantportal?redirect=/api/intake?code=testcode'
    );
  });

  it('should redirect to dashboard if user is ccbc admin', async () => {
    mocked(getAuthRole).mockImplementation(() => {
      return {
        pgRole: 'ccbc_admin',
        landingRoute: '/',
      };
    });

    const res = await request(app)
      .get('/api/intake')
      .query({ code: 'testcode' });
    expect(res.status).toBe(302);
    expect(res.header.location).toBe('/analyst/dashboard');
  });
  it('should redirect to dashboard if user is cbc admin', async () => {
    mocked(getAuthRole).mockImplementation(() => {
      return {
        pgRole: 'cbc_admin',
        landingRoute: '/',
      };
    });

    const res = await request(app)
      .get('/api/intake')
      .query({ code: 'testcode' });
    expect(res.status).toBe(302);
    expect(res.header.location).toBe('/analyst/dashboard');
  });
  it('should redirect to dashboard if user is super admin', async () => {
    mocked(getAuthRole).mockImplementation(() => {
      return {
        pgRole: 'super_admin',
        landingRoute: '/',
      };
    });

    const res = await request(app)
      .get('/api/intake')
      .query({ code: 'testcode' });
    expect(res.status).toBe(302);
    expect(res.header.location).toBe('/analyst/dashboard');
  });
  it('should redirect to dashboard if user is ccbc analyst', async () => {
    mocked(getAuthRole).mockImplementation(() => {
      return {
        pgRole: 'ccbc_analyst',
        landingRoute: '/',
      };
    });

    const res = await request(app)
      .get('/api/intake')
      .query({ code: 'testcode' });
    expect(res.status).toBe(302);
    expect(res.header.location).toBe('/analyst/dashboard');
  });
});
