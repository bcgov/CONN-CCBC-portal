/**
 * @jest-environment node
 */
import email from 'backend/lib/emails/email';
import bodyParser from 'body-parser';
import express from 'express';
import request from 'supertest';
import { mocked } from 'jest-mock';
import assesmentSecondReviewChange from 'backend/lib/emails/templates/assesmentSecondReviewChange';
import handleEmailNotification from 'backend/lib/emails/handleEmailNotification';
import agreementSignedStatusChange from 'backend/lib/emails/templates/agreementSignedStatusChange';

jest.mock('backend/lib/emails/handleEmailNotification');

describe('Email API Endpoints', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(bodyParser.json());
    app.use('/', email);
    mocked(handleEmailNotification).mockImplementationOnce(async (req, res) => {
      return res.status(200).json({ success: true }).end();
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('calls handleEmailNotification with correct parameters once notifyAgreementSigned called', async () => {
    const reqBody = {
      ccbcNumber: 'CCBC-00001',
      assessmentType: 'screening',
    };
    await request(app).post('/api/email/notifyAgreementSigned').send(reqBody);
    expect(handleEmailNotification).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      agreementSignedStatusChange
    );
  });

  it('calls handleEmailNotification with correct parameters once notifySecondReviewRequest called', async () => {
    const reqBody = {
      ccbcNumber: 'CCBC-00001',
      assessmentType: 'screening',
    };
    await request(app)
      .post('/api/email/notifySecondReviewRequest')
      .send(reqBody);
    expect(handleEmailNotification).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      assesmentSecondReviewChange,
      reqBody
    );
  });
});
