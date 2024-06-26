import sendEmailMerge from 'backend/lib/ches/sendEmailMerge';

describe('getAccessToken', () => {
  it('should return a token when the request is successful', async () => {
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

    const email = await sendEmailMerge(
      'test_token',
      'test_body',
      'test_subject',
      [
        {
          to: ['mock_email@gov.bc.ca'],
          context: {},
          delayTS: 0,
          tag: 'test_tag',
        },
      ]
    );
    expect(email.messages[0].msgId).toBe('mock_message_id');
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
      sendEmailMerge('test_token', 'test_body', 'test_subject', [
        {
          to: ['mock_email@gov.bc.ca'],
          context: {},
          delayTS: 0,
          tag: 'test_tag',
        },
      ])
    ).rejects.toThrow('Error sending merge with status: 422');
  });
});
