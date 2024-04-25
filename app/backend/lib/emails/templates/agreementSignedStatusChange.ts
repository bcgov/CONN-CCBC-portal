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
    emailTo: [72], // Temporary IDs to handle email recipients
    emailCC: [],
    tag: 'agreement-signed-status-change',
    subject: `Action Required - Upload SOW for ${ccbcNumber}`,
    body: `
      <h1>${initiator.givenName} ${initiator.familyName} has changed the status for ${ccbcNumber} to 'Agreement Signed'</h1>
      <p>Please upload the SOW <a href='${url}/analyst/application/${applicationId}/project'>here</a><p>
    `,
  };
};

export default agreementSignedStatusChange;
