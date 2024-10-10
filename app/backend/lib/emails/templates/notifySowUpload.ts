import {
  EmailTemplate,
  EmailTemplateProvider,
} from '../handleEmailNotification';

const notifySowUpload: EmailTemplateProvider = (
  applicationId: string,
  url: string,
  initiator: any,
  params: any
): EmailTemplate => {
  const { ccbcNumber, amendmentNumber } = params;
  const amendmentLink = `<a href='${url}/analyst/application/${applicationId}/project?section=projectInformation'>${amendmentNumber}</a>`;
  const description = amendmentNumber
    ? `Amendment ${amendmentLink} for ${ccbcNumber} due to a change request.`
    : `${ccbcNumber}.`;
  return {
    emailTo: [70],
    emailCC: [],
    tag: 'sow-upload-review',
    subject: `Action Required - Review Project Description and Project Type for ${ccbcNumber}`,
    body: `
          <h1>${initiator.givenName} has uploaded a SOW for ${description}</h1>
          <p>Please review the Project Description and Project Type in the header <a href='${url}/analyst/application/${applicationId}/summary'>here</a> and update if required.</p>

          <p>To unsubscribe from this notification please forward this email with your request to <a href="mailto:meherzad.romer@gov.bc.ca">meherzad.romer@gov.bc.ca<a/></p>
      `,
  };
};

export default notifySowUpload;
