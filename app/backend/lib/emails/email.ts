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

const email = Router();

const limiter = RateLimit({
  windowMs: 1 * 60 * 1000,
  max: 2000,
});

email.post('/api/email/notifyAgreementSigned', limiter, (req, res) => {
  const { ccbcNumber } = req.body;
  return handleEmailNotification(req, res, agreementSignedStatusChange, {
    ccbcNumber,
  });
});

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

export default email;
