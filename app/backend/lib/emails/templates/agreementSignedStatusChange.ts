import {
  EmailTemplate,
  EmailTemplateProvider,
} from '../handleEmailNotification';

const agreementSignedStatusChange: EmailTemplateProvider = (
  applicationId: string,
  url: string,
  initiator: any,
  params: any
): EmailTemplate => {
  const { ccbcNumber } = params;
  return {
    emailTo: [147], // Temporary IDs to handle email recipients
    emailCC: [],
    tag: 'agreement-signed-status-change',
    subject: `Action Required - Upload SOW for ${ccbcNumber}`,
    body: `
      <h1>${initiator.givenName} has updated the status for ${ccbcNumber} to 'Agreement Signed' 2 days ago</h1>
      <p><b>This is a reminder to upload the SOW <a href='${url}/analyst/application/${applicationId}/project'>here</a></b></p>
    `,
  };
};

export default agreementSignedStatusChange;
