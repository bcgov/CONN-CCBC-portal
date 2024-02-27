import getAccessToken from '../ches/getAccessToken';
import config from '../../../config';
import sendEmail from '../ches/sendEmail';

const CHES_TO_EMAIL = config.get('CHES_TO_EMAIL');

const agreementSignedStatusChange = async (applicationId, url) => {
  try {
    const token = await getAccessToken();
    const body = `
    <h1>Application set to Agreement Signed</h1>
    <p>This is an automated message, please <a href='${url}/analyst/application/${applicationId}/project'>click here</a> to upload the funding agreement<p>
  `;
    const subject = 'Task assigned to you: Upload Funding Agreement';
    const to = CHES_TO_EMAIL;
    const tag = 'agreement-signed-status-change';
    const emailResult = await sendEmail(token, body, subject, to, tag);
    return emailResult;
  } catch (e) {
    throw new Error(e.message);
  }
};

export default agreementSignedStatusChange;
