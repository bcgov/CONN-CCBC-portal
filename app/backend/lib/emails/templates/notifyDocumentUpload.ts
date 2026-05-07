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
  const { ccbcNumber, documentTypes, timestamp, documentNames } = params;

  const documentTypeFormatted =
    documentTypes.length > 1 ? 'multiple files' : `A ${documentTypes[0]}`;

  const section = {
    'Claim & Progress Report': 'project?section=claimsReport',
    'Community Progress Report': 'project?section=communityProgressReport',
    'Milestone Report': 'project?section=milestoneReport',
    'Statement of Work': 'project?section=projectInformation',
  };

  const link = `<a href='${url}/analyst/application/${applicationId}/${section[documentTypes[0]] ?? 'rfi'}'>${ccbcNumber}</a>`;
  return {
    emailTo: [112, 10, 111],
    emailCC: [],
    tag: 'document-upload-notification',
    subject: `${documentTypeFormatted} uploaded in Portal`,
    body: `
        <h1>${documentTypeFormatted} uploaded in Portal</h1>

        <p>Notification: ${documentTypeFormatted} has been uploaded in the Portal for ${link} on ${timestamp}.</p>
        <ul>
          ${documentNames.map((file) => `<li><em>${file}</em></li>`).join('')}
        </ul>
    `,
  };
};

export default notifyDocumentUpload;
