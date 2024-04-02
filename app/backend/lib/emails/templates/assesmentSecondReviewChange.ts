import config from '../../../../config';
import { EmailTemplate } from '../handleEmailNotification';

const assesmentSecondReviewChange = (
  applicationId: string,
  url: string,
  initiator: string,
  params: any
): EmailTemplate => {
  const { ccbcNumber } = params;
  return {
    emailTo: config.get('CHES_TO_EMAIL_SECOND_REVIEW')?.split(','),
    emailCC: [],
    tag: 'assesment-second-review-change',
    subject: `${initiator} requested a 2nd Review for Eligibility Screening - ${ccbcNumber}`,
    body: `
    <h1>${initiator} requested a 2nd Review for Eligibility Screening - ${ccbcNumber}</h1>
    <p>${initiator} requested a 2nd Review for Eligibility Screening - ${ccbcNumber}, <a href='${url}/analyst/application/${applicationId}/assessments/screening'>Click here</a> to view the Eligibility Screening in the CCBC Portal<p>
  `,
  };
};

export default assesmentSecondReviewChange;
