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
  const { ccbcNumber, documentType, timestamp, documentNames, fileDetails } = params;

  const section = {
    'Claim & Progress Report': 'project?section=claimsReport',
    'Community Progress Report': 'project?section=communityProgressReport',
    'Milestone Report': 'project?section=milestoneReport',
    'Statement of Work': 'project?section=projectInformation',
    'Email Correspondence': 'rfi',
  };

  const link = `<a href='${url}/analyst/application/${applicationId}/${section[documentType] ?? 'rfi'}'>${ccbcNumber}</a>`;
  
  // Build file list with type information if available
  let fileList = '';
  if (fileDetails && Array.isArray(fileDetails)) {
    fileList = fileDetails
      .map((file) => `<li><em>${file.name}</em> <strong>(Type: ${file.type})</strong></li>`)
      .join('');
  } else {
    fileList = documentNames.map((file) => `<li><em>${file}</em></li>`).join('');
  }

  return {
    emailTo: [112, 10, 111],
    emailCC: [],
    tag: 'document-upload-notification',
    subject: `${documentType} uploaded in Portal`,
    body: `
        <h1>${documentType} uploaded in Portal</h1>

        <p>Notification: A ${documentType} has been uploaded in the Portal for ${link} on ${timestamp}.</p>
        <ul>
          ${fileList}
        </ul>
    `,
  };
};

export default notifyDocumentUpload;
