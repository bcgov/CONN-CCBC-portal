import sendEmail from 'backend/lib/ches/sendEmail';

import * as emailRecordModule from 'backend/lib/emails/utils/emailRecord';

jest.mock('backend/lib/emails/utils/emailRecord', () => ({
  __esModule: true,
  recordEmailRecord: jest.fn(),
}));

describe('send email', () => {
  it('should return a message id when the request is successful', async () => {
    // Mock the fetch response
    // @ts-ignore
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () =>
          Promise.resolve({
            messages: [
              {
                msgId: 'mock_message_id',
                to: ['mock_email@gov.bc.ca'],
              },
            ],
            txId: 'mock_tx_id',
          }),
      })
    );

    const email = await sendEmail(
      'test_token',
      'test_body',
      'test_subject',
      'mock_email@gov.bc.ca',
      'test_tag'
    );
    expect(email).toBe('mock_message_id');
  });

  it('should throw an error when the request fails', async () => {
    // Mock the fetch response
    // @ts-ignore
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 422,
      })
    );

    await expect(
      sendEmail(
        'test_token',
        'test_body',
        'test_subject',
        'mock_email@gov.bc.ca',
        'test_tag'
      )
    ).rejects.toThrow('Error sending email with status: 422');
  });

  it('should process email record when req and applicationId are provided', async () => {
    // Mock the fetch response
    // @ts-ignore
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () =>
          Promise.resolve({
            messages: [
              {
                msgId: 'mock_message_id',
                to: ['mock_email@gov.bc.ca'],
              },
            ],
            txId: 'mock_tx_id',
          }),
      })
    );
    // Mock the email record processing
    (emailRecordModule.recordEmailRecord as jest.Mock).mockImplementation(() =>
      Promise.resolve()
    );
    const req = { body: { someData: 'test' } };
    const applicationId = 1;
    const email = await sendEmail(
      'test_token',
      'test_body',
      'test_subject',
      'mock_email@gov.bc.ca',
      'test_tag',
      [],
      [],
      0,
      req,
      applicationId
    );
    expect(email).toBe('mock_message_id');
  });
});
