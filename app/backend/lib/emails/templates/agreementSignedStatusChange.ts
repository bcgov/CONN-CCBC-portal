import { EmailTemplate } from '../handleEmailNotification';
import config from '../../../../config';

const agreementSignedStatusChange = (
  applicationId: string,
  url: string
): EmailTemplate => {
  return {
    emailTo: [config.get('CHES_TO_EMAIL')],
    emailCC: [],
    tag: 'agreement-signed-status-change',
    subject: 'Task assigned to you: Upload Funding Agreement',
    body: `
      <h1>Application set to Agreement Signed</h1>
      <p>This is an automated message, please <a href='${url}/analyst/application/${applicationId}/project'>click here</a> to upload the funding agreement<p>
    `,
  };
};

export default agreementSignedStatusChange;
