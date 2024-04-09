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
});
