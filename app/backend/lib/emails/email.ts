import { Router } from 'express';
import agreementSignedStatusChange from './templates/agreementSignedStatusChange';
import assesmentSecondReviewChange from './templates/assesmentSecondReviewChange';
import { handleEmailNotification } from './handleEmailNotification';

const email = Router();

email.post('/api/email/notifyAgreementSigned', (req, res) => {
  return handleEmailNotification(req, res, agreementSignedStatusChange);
});

email.post('/api/email/notifySecondReviewRequest', (req, res) => {
  const { ccbcNumber } = req.body;
  return handleEmailNotification(req, res, assesmentSecondReviewChange, {
    ccbcNumber,
  });
});

export default email;
