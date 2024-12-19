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
import agreementSignedStatusChangeDataTeam from 'backend/lib/emails/templates/agreementSignedStatusChangeDataTeam';
import assessmentAssigneeChange from 'backend/lib/emails/templates/assessmentAssigneeChange';
import householdCountUpdate from 'backend/lib/emails/templates/householdCountUpdate';
import rfiCoverageMapKmzUploaded from 'backend/lib/emails/templates/rfiCoverageMapKmzUploaded';
import notifyConditionallyApproved from 'backend/lib/emails/templates/notifyConditionallyApproved';
import notifyApplicationSubmission from 'backend/lib/emails/templates/notifyApplicationSubmission';
import notifyFailedReadOfTemplateData from 'backend/lib/emails/templates/notifyFailedReadOfTemplateData';
import notifySowUpload from 'backend/lib/emails/templates/notifySowUpload';
import notifyDocumentUpload from 'backend/lib/emails/templates/notifyDocumentUpload';

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
      agreementSignedStatusChange,
      { ccbcNumber: reqBody.ccbcNumber }
    );
  });

  it('calls handleEmailNotification with correct parameters once notifyAgreementSignedDataTeam called', async () => {
    const reqBody = {
      ccbcNumber: 'CCBC-00001',
      assessmentType: 'screening',
    };
    await request(app)
      .post('/api/email/notifyAgreementSignedDataTeam')
      .send(reqBody);
    expect(handleEmailNotification).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      agreementSignedStatusChangeDataTeam,
      { ccbcNumber: reqBody.ccbcNumber }
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

  it('calls handleEmailNotification with correct parameters once assessmentAssigneeChange called', async () => {
    const reqBody = {
      applicationId: '',
      params: { assignments: [] },
    };
    await request(app)
      .post('/api/email/assessmentAssigneeChange')
      .send(reqBody);
    expect(handleEmailNotification).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      assessmentAssigneeChange,
      { assignments: [] },
      true
    );
  });

  it('calls handleEmailNotification with correct parameters once householdCountUpdate called', async () => {
    const reqBody = {
      applicationId: '',
      params: { organizationName: 'test' },
    };
    await request(app).post('/api/email/householdCountUpdate').send(reqBody);
    expect(handleEmailNotification).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      householdCountUpdate,
      { organizationName: 'test' }
    );
  });

  it('calls handleEmailNotification with correct parameters once rfiCoverageMapKmzUploaded called', async () => {
    const reqBody = {
      applicationId: '1',
      params: {
        applicationId: '1',
        host: 'http://mock_host.ca',
        ccbcNumber: 'CCBC-010040',
        rfiFormData: {
          rfiType: ['Technical'],
          rfiAdditionalFiles: {
            geographicCoverageMap: {},
            geographicCoverageMapRfi: true,
          },
          rfiDueBy: '2024-06-26',
        },
        rfiNumber: 'CCBC-010040-8',
        changes: [
          {
            id: 1937,
            uuid: 'e723c93c-e656-45c9-9a5c-39ab8d4ab6e5',
            name: '1.kmz',
            size: 0,
            type: '',
            uploadedAt: '2024-05-31T14:05:03.509-07:00',
          },
        ],
        organizationName: 'test',
      },
    };
    await request(app)
      .post('/api/email/notifyRfiCoverageMapKmzUploaded')
      .send(reqBody);
    expect(handleEmailNotification).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      rfiCoverageMapKmzUploaded,
      {
        applicationId: '1',
        params: {
          applicationId: '1',
          host: 'http://mock_host.ca',
          ccbcNumber: 'CCBC-010040',
          rfiFormData: {
            rfiType: ['Technical'],
            rfiAdditionalFiles: {
              geographicCoverageMap: {},
              geographicCoverageMapRfi: true,
            },
            rfiDueBy: '2024-06-26',
          },
          rfiNumber: 'CCBC-010040-8',
          changes: [
            {
              id: 1937,
              uuid: 'e723c93c-e656-45c9-9a5c-39ab8d4ab6e5',
              name: '1.kmz',
              size: 0,
              type: '',
              uploadedAt: '2024-05-31T14:05:03.509-07:00',
            },
          ],
          organizationName: 'test',
        },
      }
    );
  });

  it('calls notifyConditionalApproval with correct parameters once notifyConditionalApproval called', async () => {
    const reqBody = {
      applicationId: '',
      ccbcNumber: 'CCBC-00001',
      params: { requiredFields: ['Project Type'] },
    };
    await request(app)
      .post('/api/email/notifyConditionalApproval')
      .send(reqBody);
    expect(handleEmailNotification).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      notifyConditionallyApproved,
      { ccbcNumber: 'CCBC-00001', requiredFields: ['Project Type'] }
    );
  });

  it('calls notifyApplicationSubmission with correct parameters once notifyApplicationSubmission called', async () => {
    const reqBody = {
      applicationId: '',
      params: {},
    };
    await request(app)
      .post('/api/email/notifyApplicationSubmission')
      .send(reqBody);
    expect(handleEmailNotification).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      notifyApplicationSubmission,
      {}
    );
  });

  it('calls notifyFailedReadOfTemplateData with correct parameters once notifyFailedReadOfTemplateData called', async () => {
    const reqBody = {
      applicationId: '',
      params: {},
    };
    await request(app)
      .post('/api/email/notifyFailedReadOfTemplateData')
      .send(reqBody);
    expect(handleEmailNotification).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      notifyFailedReadOfTemplateData,
      {}
    );
  });

  it('calls notifySowUpload with correct parameters once notifySowUpload called', async () => {
    const reqBody = {
      applicationId: '',
      ccbcNumber: 'CCBC-00001',
      params: { amendmentNumber: 1 },
    };
    await request(app).post('/api/email/notifySowUpload').send(reqBody);
    expect(handleEmailNotification).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      notifySowUpload,
      { ccbcNumber: 'CCBC-00001', amendmentNumber: 1 }
    );
  });

  it('calls notifyDocumentUpload with correct parameters once notifyDocumentUpload called', async () => {
    const reqBody = {
      applicationId: '1',
      ccbcNumber: 'CCBC-00001',
      params: {
        ccbcNumber: 'CCBC-00001',
        documentType: 'Statement of Work',
        timestamp: '2024-06-26',
        documentNames: ['file1', 'file2'],
      },
    };
    await request(app).post('/api/email/notifyDocumentUpload').send(reqBody);
    expect(handleEmailNotification).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      notifyDocumentUpload,
      {
        ccbcNumber: 'CCBC-00001',
        documentType: 'Statement of Work',
        timestamp: '2024-06-26',
        documentNames: ['file1', 'file2'],
      }
    );
  });
});
