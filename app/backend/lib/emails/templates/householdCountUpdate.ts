import {
  EmailTemplate,
  EmailTemplateProvider,
} from '../handleEmailNotification';

const householdCountUpdate: EmailTemplateProvider = (
  applicationId: string,
  url: string,
  initiator: any,
  params: any
): EmailTemplate => {
  const {
    ccbcNumber,
    timestamp,
    fieldsChanged,
    manualUpdate = false,
    reasonProvided,
    rfiNumber = null,
    organizationName = null,
  } = params;

  let bodyFromUploadUpdate = null;
  if (!manualUpdate) {
    const fieldChanges = Object.entries(fieldsChanged).map(
      ([field, counts]: [string, any]) =>
        `<li>${field}: changed from ${counts.old} to ${counts.new}</li>`
    );

    bodyFromUploadUpdate = `
      <p>${organizationName || initiator.givenName} has uploaded a new Template 1 on ${timestamp} as part of <strong>RFI : ${rfiNumber}</strong> which has updated the following:</p>
      <ul>
        ${fieldChanges.join('')}
      </ul>
    `;
  }

  return {
    emailTo: [77], // Temporary IDs to handle email recipients
    emailCC: [],
    tag: 'agreement-signed-status-change',
    subject: `${organizationName || initiator.givenName} has updated the household numbers for ${ccbcNumber}`,
    body: manualUpdate
      ? `
        <p>${organizationName || initiator.givenName} has manually updated the <strong>${Object.keys(fieldsChanged).join(' and ')}</strong> on ${timestamp}</p>
        <em>Reason given: ${reasonProvided}<em>
      `
      : bodyFromUploadUpdate,
  };
};

export default householdCountUpdate;
