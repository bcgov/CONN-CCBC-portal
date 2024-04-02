import { mocked } from 'jest-mock';
import assesmentSecondReviewChange from 'backend/lib/emails/templates/assesmentSecondReviewChange';
import config from '../../../../../config';

jest.mock('../../../../../config');

describe('assesmentSecondReviewChange template', () => {
  it('should return an email template with correct properties', () => {
    mocked(config.get).mockImplementation((name: any) => {
      const mockConfig = {
        CHES_TO_EMAIL_SECOND_REVIEW: 'sender1@mail.com,sender2@mail.com',
        CHES_TO_EMAIL: 'test@mail.com',
      };
      return mockConfig[name] as any;
    });
    const applicationId = '1';
    const url = 'http://mock_host.ca';
    const initiator = 'CCBC User';
    const params = { ccbcNumber: 'ABC' };

    const emailTemplate = assesmentSecondReviewChange(
      applicationId,
      url,
      initiator,
      params
    );

    expect(emailTemplate).toEqual(
      expect.objectContaining({
        emailTo: ['sender1@mail.com', 'sender2@mail.com'],
        emailCC: [],
        tag: 'assesment-second-review-change',
        subject: `${initiator} requested a 2nd Review for Eligibility Screening - ABC`,
      })
    );

    expect(emailTemplate.body).toContain(
      `<a href='http://mock_host.ca/analyst/application/1/assessments/screening'>Click here</a>`
    );
  });
});
