import { Router } from 'express';
import getAuthRole from '../../utils/getAuthRole';
import agreementSignedStatusChange from './emails/agreementSignedStatusChange';

const email = Router();

// eslint-disable-next-line consistent-return
email.post('/api/email/notifyAgreementSigned', (req, res) => {
  const authRole = getAuthRole(req);
  const isRoleAuthorized =
    authRole?.pgRole === 'ccbc_admin' || authRole?.pgRole === 'ccbc_analyst';
  if (!isRoleAuthorized) {
    return res.status(404).end();
  }
  const { applicationId, host } = req.body;

  let sendEmailResult;
  (async () => {
    try {
      sendEmailResult = await agreementSignedStatusChange(applicationId, host);
      if (sendEmailResult) {
        return res.status(200).json(sendEmailResult).end();
      }
      return res.status(400).json({ error: 'Failed to send email' }).end();
    } catch (e) {
      return res.status(400).json({ error: 'Failed to send email' }).end();
    }
  })();
});

export default email;
