import {
  EmailTemplate,
  EmailTemplateProvider,
} from '../handleEmailNotification';

const formats = {
  projectManagement: {
    type: 'Project Management assessment',
    slug: 'project-management',
  },
  permitting: { type: 'Permitting assessment', slug: 'permitting' },
  technical: { type: 'Technical assessment', slug: 'technical' },
  gis: { type: 'GIS assessment', slug: 'gis' },
  financialRisk: { type: 'Financial Risk assessment', slug: 'financial-risk' },
  screening: { type: 'Eligibility Screening', slug: 'screening' },
};

const assesmentSecondReviewChange: EmailTemplateProvider = (
  applicationId: string,
  url: string,
  initiator: any,
  params: any
): EmailTemplate => {
  const { ccbcNumber, assessmentType } = params;
  const { type, slug } = formats[assessmentType];

  return {
    emailTo: [34, 71], // Temporary IDs to handle email recipients
    emailCC: [],
    tag: 'assesment-second-review-change',
    subject: `${initiator.givenName} has requested a 2nd Review for ${type} - ${ccbcNumber}`,
    body: `
    <h1>${initiator.givenName} requested a 2nd Review on ${type} - ${ccbcNumber}</h1>
    <p>${initiator.givenName} requested a 2nd Review on ${type} - ${ccbcNumber}, <a href='${url}/analyst/application/${applicationId}/assessments/${slug}'>Click here</a> to view the ${type} in the CCBC Portal<p>
    <p>To unsubscribe from this notification please forward this email with your request to <a href="mailto:meherzad.romer@gov.bc.ca">meherzad.romer@gov.bc.ca<a/></p>
  `,
  };
};

export default assesmentSecondReviewChange;
