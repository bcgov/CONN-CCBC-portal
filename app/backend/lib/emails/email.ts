import { Router } from 'express';
import RateLimit from 'express-rate-limit';
import agreementSignedStatusChange from './templates/agreementSignedStatusChange';
import assesmentSecondReviewChange from './templates/assesmentSecondReviewChange';
import handleEmailNotification from './handleEmailNotification';
import agreementSignedStatusChangeDataTeam from './templates/agreementSignedStatusChangeDataTeam';

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

export default email;
