import {
  EmailTemplate,
  EmailTemplateProvider,
} from '../handleEmailNotification';

const agreementSignedStatusChangeDataTeam: EmailTemplateProvider = (
  applicationId: string,
  url: string,
  initiator: string,
  params: any
): EmailTemplate => {
  const { ccbcNumber } = params;
  return {
    emailTo: [], // Temporary IDs to handle email recipients
    emailCC: [],
    tag: 'agreement-signed-status-change-data-team',
    subject: `Action Required - Upload KMZ for ${ccbcNumber}`,
    body: `
      <h1>${initiator} has changed the status for ${ccbcNumber} to 'Agreement Signed'</h1>
      <p>Please upload the KMZ file <a href='${url}/analyst/application/${applicationId}/project'>here</a><p>
    `,
  };
};

export default agreementSignedStatusChangeDataTeam;
