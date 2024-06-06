import {
  EmailTemplate,
  EmailTemplateProvider,
} from '../handleEmailNotification';

const notifyConditionallyApproved: EmailTemplateProvider = (
  applicationId: string,
  url: string,
  initiator: any,
  params: any
): EmailTemplate => {
  const { ccbcNumber, requiredFields } = params;
  return {
    emailTo: [70], // Temporary IDs to handle email recipients
    emailCC: [],
    tag: 'conditionally-approved-status-change',
    subject: `Action Required - Update ${requiredFields.join(' and ')} for ${ccbcNumber}`,
    body: `
        <h1>${initiator.givenName} has changed the status for ${ccbcNumber} to 'Conditionally Approved'</h1>
        <p>Please update the ${requiredFields.join(' and ')} in the header <a href='${url}/analyst/application/${applicationId}/project'>here</a><p>

        <p>To unsubscribe from this notification please forward this email with your request to <a href="mailto:meherzad.romer@gov.bc.ca">meherzad.romer@gov.bc.ca<a/></p>
    `,
  };
};

export default notifyConditionallyApproved;
