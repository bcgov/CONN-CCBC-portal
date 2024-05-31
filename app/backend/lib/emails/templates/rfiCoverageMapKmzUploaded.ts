import {
  EmailTemplate,
  EmailTemplateProvider,
} from '../handleEmailNotification';

const rfiCoverageMapKmzUploaded: EmailTemplateProvider = (
  applicationId: string,
  url: string,
  initiator: any,
  params: any
): EmailTemplate => {
  const { ccbcNumber, rfiFormData, rfiNumber, changes, organizationName } =
    params;
  console.log('params', params);
  return {
    emailTo: [77, 34, 72], // Temporary IDs to handle email recipients
    emailCC: [],
    tag: 'rfi-coverage-map-kmz-uploaded',
    subject: `Notification - A KMZ was uploaded to ${ccbcNumber}`,
    body: `
        <h1>KMZ file uploaded for RFI ${rfiNumber}</h1>
        <p>${organizationName || initiator.givenName} has uploaded the following KMZ(s):</p>
        <ul>
          ${changes.map((file: any) => `<li>${file.name}</li>`).join('')}
        </ul>
        <p>This <a href='${url}/analyst/application/${applicationId}/rfi'>RFI</a> closes/closed on ${rfiFormData?.rfiDueBy}<p>
        <p>To unsubscribe from this notification please forward this email with your request to <a href="mailto:meherzad.romer@gov.bc.ca">meherzad.romer@gov.bc.ca<a/></p>
      `,
  };
};

export default rfiCoverageMapKmzUploaded;
