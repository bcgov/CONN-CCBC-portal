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

  const emailFooter = `
    <p>This email is for information purposes, no action is necessarily required.</p>
    <p>To unsubscribe from this notification please forward this email with your request to <a href="mailto:meherzad.romer@gov.bc.ca">meherzad.romer@gov.bc.ca<a/></p>`;

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
  const b = (
    manualUpdate
      ? `
    <p>${organizationName || initiator.givenName} has manually updated the <strong>${Object.keys(fieldsChanged).join(' and ')}</strong> on ${timestamp}</p>
    <em>Reason given: ${reasonProvided}<em>
  `
      : bodyFromUploadUpdate
  ).concat(emailFooter);
  return {
    emailTo: [77], // Temporary IDs to handle email recipients
    emailCC: [],
    tag: 'agreement-signed-status-change',
    subject: `${organizationName || initiator.givenName} has updated the household numbers for ${ccbcNumber}`,
    body: b,
  };
};

export default householdCountUpdate;
