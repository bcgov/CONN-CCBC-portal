import {
  EmailTemplate,
  EmailTemplateProvider,
} from '../handleEmailNotification';

const getUploadedFileList = (
  documentNames: string[],
  documentTypes: string[]
) =>
  documentNames
    .map((file, index) => {
      const documentType =
        documentTypes.length === 1 ? documentTypes[0] : documentTypes[index];

      return `<li><em>${file}</em>${documentType ? ` (${documentType})` : ''}</li>`;
    })
    .join('');

const notifyDocumentUpload: EmailTemplateProvider = (
  applicationId: string,
  url: string,
  initiator: any,
  params: any
): EmailTemplate => {
  const { ccbcNumber, documentTypes, timestamp, documentNames, rfiNumber } =
    params;

  let documentTypeFormatted =
    documentTypes.length > 1 ? 'Multiple files' : `A ${documentTypes[0]}`;

  const section = {
    'Claim & Progress Report': 'project?section=claimsReport',
    'Community Progress Report': 'project?section=communityProgressReport',
    'Milestone Report': 'project?section=milestoneReport',
    'Statement of Work': 'project?section=projectInformation',
  };
  let link = `<a href='${url}/analyst/application/${applicationId}/${section[documentTypes[0]] ?? 'rfi'}'>${ccbcNumber}</a>`;

  if (rfiNumber) {
    link = `<a href='${url}/analyst/application/${applicationId}/rfi'>RFI ${rfiNumber}</a>`;
    documentTypeFormatted = documentTypes.includes('Email Correspondence')
      ? 'RFI Email Correspondence'
      : documentTypeFormatted;
  }

  return {
    emailTo: [112, 10, 111],
    emailCC: [],
    tag: 'document-upload-notification',
    subject: `${documentTypeFormatted} uploaded in Portal`,
    body: `
        <h1>${documentTypeFormatted} uploaded in Portal</h1>

        <p>Notification: ${documentTypeFormatted} has been uploaded in the Portal for ${link} on ${timestamp}.</p>
        <p>File(s) uploaded:</p>
        <ul>
          ${getUploadedFileList(documentNames, documentTypes)}
        </ul>
    `,
  };
};

export default notifyDocumentUpload;
