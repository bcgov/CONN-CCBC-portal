import { Router } from 'express';
import RateLimit from 'express-rate-limit';
import agreementSignedStatusChange from './templates/agreementSignedStatusChange';
import assesmentSecondReviewChange from './templates/assesmentSecondReviewChange';
import handleEmailNotification from './handleEmailNotification';
import agreementSignedStatusChangeDataTeam from './templates/agreementSignedStatusChangeDataTeam';
import assessmentAssigneeChange from './templates/assessmentAssigneeChange';
import householdCountUpdate from './templates/householdCountUpdate';
import rfiCoverageMapKmzUploaded from './templates/rfiCoverageMapKmzUploaded';
import notifyConditionallyApproved from './templates/notifyConditionallyApproved';
import notifyApplicationSubmission from './templates/notifyApplicationSubmission';
import notifyFailedReadOfTemplateData from './templates/notifyFailedReadOfTemplateData';
import notifySowUpload from './templates/notifySowUpload';
import notifyDocumentUpload from './templates/notifyDocumentUpload';
import calculateDelayTs from './utils/delayCalculator';
import {
  getDelayedAndNonCancelledEmailRecord,
  setIsCancelledEmailRecord,
} from './utils/emailRecord';
import { reportServerError, sendErrorNotification } from './errorNotification';
import getAccessToken from '../ches/getAccessToken';
import { cancelDelayedMessageByMsgId } from '../ches/cancelDelayedMessage';

const email = Router();

const limiter = RateLimit({
  windowMs: 1 * 60 * 1000,
  max: 2000,
});

email.post('/api/email/notifyAgreementSigned', limiter, (req, res) => {
  const { ccbcNumber } = req.body;
  const delay = calculateDelayTs(
    new Date(),
    48 // Delay in hours
  );
  return handleEmailNotification(
    req,
    res,
    agreementSignedStatusChange,
    {
      ccbcNumber,
    },
    false,
    delay
  );
});

email.post(
  '/api/email/notifyAgreementSignedCancel',
  limiter,
  async (req, res) => {
    try {
      const { applicationId } = req.body;
      if (!applicationId) {
        return res
          .status(400)
          .json({ error: 'applicationId is required' })
          .end();
      }
      const applicationIdNumber = parseInt(applicationId, 10);
      if (Number.isNaN(applicationIdNumber)) {
        return res
          .status(400)
          .json({ error: 'applicationId must be a valid number' })
          .end();
      }
      const recordsToCancel = await getDelayedAndNonCancelledEmailRecord(
        applicationIdNumber,
        'agreement-signed-status-change',
        req
      );
      if (
        !recordsToCancel ||
        !recordsToCancel.data ||
        !recordsToCancel.data.allEmailRecords ||
        recordsToCancel.data.allEmailRecords.edges.length === 0
      ) {
        return res.status(200).json({ message: 'No records to cancel' }).end();
      }
      // there are records to cancel
      // get a ches token
      const token = await getAccessToken();
      // cancel the records and record the cancellation
      await Promise.all(
        recordsToCancel.data.allEmailRecords.edges.map(async (record) => {
          const chesCancelResult = await cancelDelayedMessageByMsgId(
            token,
            record.node.messageId
          );
          if (
            chesCancelResult.status === 'conflict' ||
            chesCancelResult.status === 'accepted'
          ) {
            // now record the cancellation in the database
            await setIsCancelledEmailRecord(
              record.node.rowId,
              record.node.jsonData,
              req
            );
          }
        })
      );
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.error('Error cancelling email records:', error);
      return res.status(500).json({ error: 'Internal server error' }).end();
    }
    // if we reach here, all records have been cancelled
    return res.status(200).json({ message: 'Email records cancelled' }).end();
  }
);
email.post('/api/email/notifyAgreementSignedDataTeam', limiter, (req, res) => {
  const { ccbcNumber } = req.body;
  handleEmailNotification(req, res, agreementSignedStatusChangeDataTeam, {
    ccbcNumber,
  });
});

email.post('/api/email/notifySecondReviewRequest', limiter, (req, res) => {
  const { ccbcNumber, assessmentType } = req.body;
  return handleEmailNotification(req, res, assesmentSecondReviewChange, {
    ccbcNumber,
    assessmentType,
  });
});

email.post('/api/email/assessmentAssigneeChange', limiter, (req, res) => {
  const { params } = req.body;
  return handleEmailNotification(
    req,
    res,
    assessmentAssigneeChange,
    params,
    true
  );
});

email.post('/api/email/householdCountUpdate', limiter, (req, res) => {
  const { params } = req.body;
  return handleEmailNotification(req, res, householdCountUpdate, params);
});
email.post(
  '/api/email/notifyRfiCoverageMapKmzUploaded',
  limiter,
  (req, res) => {
    const params = req.body;
    return handleEmailNotification(req, res, rfiCoverageMapKmzUploaded, params);
  }
);

email.post('/api/email/notifyConditionalApproval', limiter, (req, res) => {
  const { ccbcNumber, params } = req.body;
  return handleEmailNotification(req, res, notifyConditionallyApproved, {
    ...params,
    ccbcNumber,
  });
});

email.post('/api/email/notifyApplicationSubmission', limiter, (req, res) => {
  const { params } = req.body;
  req.claims = req.claims || ({} as any);
  req.claims.identity_provider = 'serviceaccount';
  return handleEmailNotification(req, res, notifyApplicationSubmission, {
    ...params,
  });
});

email.post('/api/email/notifyFailedReadOfTemplateData', limiter, (req, res) => {
  const { params } = req.body;
  return handleEmailNotification(
    req,
    res,
    notifyFailedReadOfTemplateData,
    params
  );
});

email.post('/api/email/notifySowUpload', limiter, (req, res) => {
  const { params, ccbcNumber } = req.body;
  return handleEmailNotification(req, res, notifySowUpload, {
    ...params,
    ccbcNumber,
  });
});

email.post('/api/email/notifyDocumentUpload', limiter, (req, res) => {
  const { params } = req.body;
  return handleEmailNotification(req, res, notifyDocumentUpload, {
    ...params,
  });
});

email.post('/api/email/notifyError', limiter, async (req, res) => {
  try {
    const { error, context, location, userAgent } = req.body || {};
    await sendErrorNotification(
      error,
      {
        ...context,
        location,
        metadata: {
          ...(context?.metadata || {}),
          userAgent,
        },
      },
      req
    );
    return res.status(200).json({ status: 'ok' }).end();
  } catch (error: any) {
    reportServerError(error, { source: 'email-notify-error' }, req);
    return res.status(500).json({ error: 'Internal server error' }).end();
  }
});

export default email;
