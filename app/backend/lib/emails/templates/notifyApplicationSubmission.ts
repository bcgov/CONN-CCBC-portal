import {
  EmailTemplate,
  EmailTemplateProvider,
} from '../handleEmailNotification';

const notifyApplicationSubmission: EmailTemplateProvider = (
  applicationId: string,
  url: string
): EmailTemplate => {
  return {
    emailTo: [71, 34, 70, 1, 3, 72, 111, 112, 10, 11, 146],
    emailCC: [],
    tag: 'application-submitted',
    subject: `CCBC Application received`,
    body: `
        <h1>CCBC Application received</h1>
        <p>We have received a new application. click <a href='${url}/analyst/application/${applicationId}'>here</a> to view it.<p>
      `,
  };
};

export default notifyApplicationSubmission;
