import {
  cancelDelayedMessageByMsgId,
  cancelDelayedMessageByTxId,
} from 'backend/lib/ches/cancelDelayedMessage';

describe('send email', () => {
  it('should return conflict when status is 409 for msg id', async () => {
    // Mock the fetch response
    // @ts-ignore
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        status: 409,
      })
    );

    const email = await cancelDelayedMessageByMsgId(
      'test_token',
      'mock_message_id'
    );
    expect(email).toStrictEqual({
      message: 'Message already sent or cancelled',
      status: 'conflict',
    });
  });

  it('should return accepted when status is 202 for msg id', async () => {
    // Mock the fetch response
    // @ts-ignore
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        status: 202,
      })
    );

    const email = await cancelDelayedMessageByMsgId(
      'test_token',
      'mock_message_id'
    );
    expect(email).toStrictEqual({
      message: 'Message cancellation in progress',
      status: 'accepted',
    });
  });

  it('should return unknown when status is not 409 or 202 for msg id', async () => {
    // Mock the fetch response
    // @ts-ignore
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        status: 500,
      })
    );

    const email = await cancelDelayedMessageByMsgId(
      'test_token',
      'mock_message_id'
    );
    expect(email).toStrictEqual({
      message: 'Message status unknown',
      status: 'unknown',
    });
  });

  it('should return conflict when status is 409 for tx id', async () => {
    // Mock the fetch response
    // @ts-ignore
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        status: 409,
      })
    );

    const email = await cancelDelayedMessageByTxId('test_token', 'mock_tx_id');
    expect(email).toStrictEqual({
      message: 'Message already sent or cancelled',
      status: 'conflict',
    });
  });

  it('should return accepted when status is 202 for tx id', async () => {
    // Mock the fetch response
    // @ts-ignore
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        status: 202,
      })
    );

    const email = await cancelDelayedMessageByTxId('test_token', 'mock_tx_id');
    expect(email).toStrictEqual({
      message: 'Message cancellation in progress',
      status: 'accepted',
    });
  });

  it('should return unknown when status is not 409 or 202 for tx id', async () => {
    // Mock the fetch response
    // @ts-ignore
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        status: 500,
      })
    );

    const email = await cancelDelayedMessageByTxId('test_token', 'mock_tx_id');
    expect(email).toStrictEqual({
      message: 'Message status unknown',
      status: 'unknown',
    });
  });
});
