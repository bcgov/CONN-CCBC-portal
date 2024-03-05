import email from 'backend/lib/email';
import bodyParser from 'body-parser';
import express from 'express';
import request from 'supertest';
import session from 'express-session';
import crypto from 'crypto';
import { mocked } from 'jest-mock';
import getAuthRole from 'utils/getAuthRole';
import agreementSignedStatusChange from 'backend/lib/emails/agreementSignedStatusChange';

jest.mock('utils/getAuthRole');
jest.mock('backend/lib/emails/agreementSignedStatusChange');

describe('The Email', () => {
  let app;

  beforeEach(async () => {
    app = express();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(session({ secret: crypto.randomUUID(), cookie: { secure: true } }));
    app.use('/', email);
  });

  it('should receive the correct response for unauthorized user', async () => {
    mocked(getAuthRole).mockImplementation(() => {
      return {
        pgRole: 'ccbc_guest',
        landingRoute: '/',
      };
    });

    const response = await request(app).post(
      '/api/email/notifyAgreementSigned'
    );
    expect(response.status).toBe(404);
  });

  it('should return 200 when email sent successfully', async () => {
    mocked(getAuthRole).mockImplementation(() => {
      return {
        pgRole: 'ccbc_admin',
        landingRoute: '/',
      };
    });

    mocked(agreementSignedStatusChange).mockImplementation(async () => {
      return 'mock_message_id';
    });

    const response = await request(app)
      .post('/api/email/notifyAgreementSigned')
      .send({ applicationId: '1', host: 'http://mock_host.ca' });
    expect(response.status).toBe(200);
  });
});
