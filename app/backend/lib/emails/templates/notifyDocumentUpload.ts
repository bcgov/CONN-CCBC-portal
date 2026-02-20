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

  const DOCUMENT_TYPES: Record<string, string> = {
    // PDF
    'application/pdf': 'PDF Document',
    // KMZ (Google Earth compressed)
    'application/vnd.google-earth.kmz': 'KMZ File',
    // KML (Google Earth markup)
    'application/vnd.google-earth.kml+xml': 'KML File',
    // XML
    'application/xml': 'XML Document',
    'text/xml': 'XML Document',
    // XLSX (Excel)
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'Excel Document',
    // DOCX (Word)
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Word Document',
  }

  const link = `<a href='${url}/analyst/application/${applicationId}/${section[documentType] ?? 'rfi'}'>${ccbcNumber}</a>`;
  
  // Build file list with type information if available
  let fileList = '';
  if (fileDetails && Array.isArray(fileDetails)) {
    fileList = fileDetails
      .map((file) => `<li><em>${file.name}</em> <strong> (Type: ${DOCUMENT_TYPES[file.type] ?? file.type})</strong></li>`)
      .join('');
  } else if (documentNames && Array.isArray(documentNames)) {
    fileList = documentNames.map((file) => `<li><em>${file}</em></li>`).join('');
  }

  // Build requested additional files list
  let requestedFilesList = '';
  if (requestedFiles && Array.isArray(requestedFiles) && requestedFiles.length > 0) {
    requestedFilesList = requestedFiles
      .map((file) => `<li><strong>${file}</strong></li>`)
      .join('');
  }

  // Build email body based on what's included
  let bodyContent = `<p>Notification: A ${documentType} has been uploaded in the Portal for ${link} on ${timestamp}.</p>`;
  
  if (fileList) {
    bodyContent += `
      <h3>Uploaded Files:</h3>
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
    subject: `${documentType} uploaded in Portal`,
    body: `
        <h1>${documentType} uploaded in Portal</h1>
        ${bodyContent}
    `,
  };
};

export default notifyDocumentUpload;
