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
  const { ccbcNumber, documentType, timestamp, documentNames, fileDetails, requestedFiles } = params;

  const section = {
    'Claim & Progress Report': 'project?section=claimsReport',
    'Community Progress Report': 'project?section=communityProgressReport',
    'Milestone Report': 'project?section=milestoneReport',
    'Statement of Work': 'project?section=projectInformation',
    'Email Correspondence': 'rfi',
    'RFI Additional Documents': 'rfi',
  };

  const link = `<a href='${url}/analyst/application/${applicationId}/${section[documentType] ?? 'rfi'}'>${ccbcNumber}</a>`;
  
  // Build file list with type information if available
  const uploadedFiles: { name: string }[] =
    fileDetails && Array.isArray(fileDetails)
      ? fileDetails
      : documentNames && Array.isArray(documentNames)
        ? documentNames.map((name: string) => ({ name }))
        : [];

  const isMultiple = uploadedFiles.length > 1;

  let fileList = '';
  if (uploadedFiles.length > 0) {
    fileList = uploadedFiles
      .map((file: any) => {
        const label = file.fieldLabel ?? documentType;
        return `<li><em>${file.name}</em> (${label})</li>`;
      })
      .join('');
  }

  // Build requested additional files list
  let requestedFilesList = '';
  if (requestedFiles && Array.isArray(requestedFiles) && requestedFiles.length > 0) {
    requestedFilesList = requestedFiles
      .map((file) => `<li><strong>${file}</strong></li>`)
      .join('');
  }

  // Files were uploaded when fileList is populated; otherwise this is a new RFI creation.
  const action = fileList ? 'uploaded' : 'created';

  // Use specific template name for a single upload; generic title for multiple.
  const title = isMultiple
    ? 'Multiple other files uploaded to RFI'
    : `${documentType} ${action}`;

  // Build email body based on what's included
  const notificationText = isMultiple
    ? `Multiple other files uploaded for ${link} on ${timestamp}.`
    : `A ${documentType} has been ${action} in the RFI page for ${link} on ${timestamp}.`;

  let bodyContent = `<p>Notification: ${notificationText}</p>`;
  
  if (fileList) {
    // const uploadedFilesHeading = isMultiple
    //   ? `Multiple files uploaded for ${ccbcNumber}`
    //   : `Uploaded Files (${documentType})`;

    bodyContent += `
      <h3>File(s) uploaded:</h3>
      <ul>
        ${fileList}
      </ul>`;
  }
  
  if (requestedFilesList) {
    bodyContent += `
      <h3>Requested Additional Documents:</h3>
      <ul>
        ${requestedFilesList}
      </ul>`;
  }

  return {
    emailTo: [112, 10, 111],
    emailCC: [],
    tag: 'document-upload-notification',
    subject: title,
    body: `
        <h1>${title}</h1>
        ${bodyContent}
    `,
  };
};

export default notifyDocumentUpload;
