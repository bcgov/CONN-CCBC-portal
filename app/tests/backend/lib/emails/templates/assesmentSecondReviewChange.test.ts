import assesmentSecondReviewChange from 'backend/lib/emails/templates/assesmentSecondReviewChange';

describe('assesmentSecondReviewChange template', () => {
  it('should return an email template with correct properties', () => {
    const applicationId = '1';
    const url = 'http://mock_host.ca';
    const initiator = 'CCBC User';
    const params = { ccbcNumber: 'ABC', assessmentType: 'screening' };

    const emailTemplate = assesmentSecondReviewChange(
      applicationId,
      url,
      initiator,
      params
    );

    expect(emailTemplate).toEqual(
      expect.objectContaining({
        emailTo: [34, 71],
        emailCC: [],
        tag: 'assesment-second-review-change',
        subject: `${initiator} has requested a 2nd Review for Eligibility Screening - ABC`,
      })
    );

    expect(emailTemplate.body).toContain(
      `<a href='http://mock_host.ca/analyst/application/1/assessments/screening'>Click here</a>`
    );
  });

  it('should generates the correct body and subject based on the assessment type provided', () => {
    const applicationId = '1';
    const url = 'http://mock_host.ca';
    const initiator = 'CCBC User';

    const emailTemplatePM = assesmentSecondReviewChange(
      applicationId,
      url,
      initiator,
      { ccbcNumber: 'ABC', assessmentType: 'projectManagement' }
    );
    expect(emailTemplatePM.subject).toEqual(
      `CCBC User has requested a 2nd Review for Eligibility Project Management - ABC`
    );
    expect(emailTemplatePM.body).toContain(
      `<a href='http://mock_host.ca/analyst/application/1/assessments/project-management'>Click here</a>`
    );

    const emailTemplatePT = assesmentSecondReviewChange(
      applicationId,
      url,
      initiator,
      { ccbcNumber: 'ABC', assessmentType: 'permitting' }
    );
    expect(emailTemplatePT.subject).toEqual(
      `CCBC User has requested a 2nd Review for Eligibility Permitting - ABC`
    );
    expect(emailTemplatePT.body).toContain(
      `<a href='http://mock_host.ca/analyst/application/1/assessments/permitting'>Click here</a>`
    );

    const emailTemplateTech = assesmentSecondReviewChange(
      applicationId,
      url,
      initiator,
      { ccbcNumber: 'ABC', assessmentType: 'technical' }
    );
    expect(emailTemplateTech.subject).toEqual(
      `CCBC User has requested a 2nd Review for Eligibility Technical - ABC`
    );
    expect(emailTemplateTech.body).toContain(
      `<a href='http://mock_host.ca/analyst/application/1/assessments/technical'>Click here</a>`
    );

    const emailTemplateGis = assesmentSecondReviewChange(
      applicationId,
      url,
      initiator,
      { ccbcNumber: 'ABC', assessmentType: 'gis' }
    );
    expect(emailTemplateGis.subject).toEqual(
      `CCBC User has requested a 2nd Review for Eligibility GIS - ABC`
    );
    expect(emailTemplateGis.body).toContain(
      `<a href='http://mock_host.ca/analyst/application/1/assessments/gis'>Click here</a>`
    );

    const emailTemplateFR = assesmentSecondReviewChange(
      applicationId,
      url,
      initiator,
      { ccbcNumber: 'ABC', assessmentType: 'financialRisk' }
    );
    expect(emailTemplateFR.subject).toEqual(
      `CCBC User has requested a 2nd Review for Eligibility Financial Risk - ABC`
    );
    expect(emailTemplateFR.body).toContain(
      `<a href='http://mock_host.ca/analyst/application/1/assessments/financial-risk'>Click here</a>`
    );
  });
});
