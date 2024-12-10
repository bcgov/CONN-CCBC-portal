import {
  EmailTemplate,
  EmailTemplateProvider,
} from '../handleEmailNotification';

const notifyDocumentUpload: EmailTemplateProvider = (
  applicationId: string,
  url: string,
  initiator: any,
  params: any
): EmailTemplate => {
  const { ccbcNumber, documentType, timestamp, documentNames } = params;

  const section = {
    'Claim & Progress Report': 'project?section=claimsReport',
    'Community Progress Report': 'project?section=communityProgressReport',
    'Milestone Report': 'project?section=milestoneReport',
    'Statement of Work': 'project?section=projectInformation',
  };

  const link = `<a href='${url}/analyst/application/${applicationId}/${section[documentType] ?? 'rfi'}'>${ccbcNumber}</a>`;
  return {
    emailTo: [112, 10, 111],
    emailCC: [],
    tag: 'document-upload-notification',
    subject: `${documentType} uploaded in Portal`,
    body: `
        <h1>${documentType} uploaded in Portal</h1>

        <p>Notification: A ${documentType} has been uploaded in the Portal for ${link} on ${timestamp}.</p>
        <ul>
          ${documentNames.map((file) => `<li><em>${file}</em></li>`).join('')}
        </ul>
    `,
  };
};

export default notifyDocumentUpload;
