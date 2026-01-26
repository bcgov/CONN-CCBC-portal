import config from '../../../config';
import { reportServerError } from '../emails/errorNotification';

const CHES_API_URL = config.get('CHES_API_URL');

export const cancelDelayedMessageByMsgId = async (
  token: string,
  messageId: string
) => {
  try {
    const response = await fetch(`${CHES_API_URL}/api/v1/cancel/${messageId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    // The message has already been sent or cancelled, conflict
    if (response.status === 409) {
      return {
        message: 'Message already sent or cancelled',
        status: 'conflict',
      };
    }
    // message cancellation in progress, accepted
    if (response.status === 202) {
      return {
        message: 'Message cancellation in progress',
        status: 'accepted',
      };
    }
    return {
      message: 'Message status unknown',
      status: 'unknown',
    };
  } catch (error: any) {
    reportServerError(error, { source: 'cancelDelayedMessageByMsgId' });
    throw new Error(error.message);
  }
};

export const cancelDelayedMessageByTxId = async (
  token: string,
  txId: string
) => {
  try {
    const response = await fetch(
      `${CHES_API_URL}/api/v1/ches/cancel?txId=${txId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    // The message has already been sent or cancelled, conflict
    if (response.status === 409) {
      return {
        message: 'Message already sent or cancelled',
        status: 'conflict',
      };
    }
    // message cancellation in progress, accepted
    if (response.status === 202) {
      return {
        message: 'Message cancellation in progress',
        status: 'accepted',
      };
    }
    return {
      message: 'Message status unknown',
      status: 'unknown',
    };
  } catch (error: any) {
    reportServerError(error, { source: 'cancelDelayedMessageByTxId' });
    throw new Error(error.message);
  }
};
