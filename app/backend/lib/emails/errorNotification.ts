/* eslint-disable import/no-cycle */
import config from '../../../config';

type ErrorMetadata = Record<string, unknown>;

export interface ErrorNotificationContext {
  source?: string;
  location?: string;
  requestId?: string;
  metadata?: ErrorMetadata;
  logMessage?: string;
}

const SKIP_NOTIFICATION_SOURCES = new Set([
  'sendEmail',
  'sendEmailMerge',
  'getAccessToken',
  'cancelDelayedMessageByMsgId',
  'cancelDelayedMessageByTxId',
  'error-notification',
]);

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

const safeStringify = (value: unknown) => {
  try {
    return JSON.stringify(value, null, 2);
  } catch (error) {
    return String(value);
  }
};

const normalizeError = (error: unknown) => {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
    };
  }

  if (error && typeof error === 'object' && 'message' in error) {
    const errorName =
      'name' in error && typeof error.name === 'string'
        ? error.name
        : 'Error';
    const errorMessage =
      typeof error.message === 'string' ? error.message : safeStringify(error);
    const errorStack =
      'stack' in error && typeof error.stack === 'string'
        ? error.stack
        : undefined;
    return {
      name: errorName,
      message: errorMessage,
      stack: errorStack,
    };
  }

  return {
    name: 'NonError',
    message: safeStringify(error),
    stack: undefined,
  };
};

const buildEmailBody = (
  errorInfo: { name: string; message: string; stack?: string },
  context: ErrorNotificationContext,
  requestDetails?: ErrorMetadata
) => {
  const contextJson = safeStringify({
    ...context,
    ...(requestDetails ? { request: requestDetails } : {}),
  });
  return `
    <h2>CCBC Portal Error</h2>
    <p><strong>Source:</strong> ${escapeHtml(context.source || 'unknown')}</p>
    ${
      context.location
        ? `<p><strong>Location:</strong> ${escapeHtml(context.location)}</p>`
        : ''
    }
    ${
      context.requestId
        ? `<p><strong>Request ID:</strong> ${escapeHtml(context.requestId)}</p>`
        : ''
    }
    <p><strong>Error Name:</strong> ${escapeHtml(errorInfo.name)}</p>
    <p><strong>Message:</strong> ${escapeHtml(errorInfo.message)}</p>
    ${
      errorInfo.stack
        ? `<pre>${escapeHtml(errorInfo.stack)}</pre>`
        : '<p><em>No stack trace available</em></p>'
    }
    <h3>Context</h3>
    <pre>${escapeHtml(contextJson)}</pre>
  `;
};

const getRequestMetadata = (req: any) => {
  if (!req) {
    return undefined;
  }

  return {
    method: req.method,
    originalUrl: req.originalUrl,
    ip: req.ip,
    userAgent: req.headers?.['user-agent'],
  };
};

export const sendErrorNotification = async (
  error: unknown,
  context: ErrorNotificationContext = {},
  req?: any
) => {
  if (context.source && SKIP_NOTIFICATION_SOURCES.has(context.source)) {
    return null;
  }
  if (config.get('NODE_ENV') === 'test') {
    return null;
  }

  const toEmail = config.get('CHES_TO_EMAIL');
  if (!toEmail) {
    console.error('CHES_TO_EMAIL is not configured for error notifications.');
    return null;
  }

  try {
    const [{ default: getAccessToken }, { default: sendEmail }] =
      await Promise.all([
        import('../ches/getAccessToken'),
        import('../ches/sendEmail'),
      ]);
    const token = await getAccessToken();
    const errorInfo = normalizeError(error);
    const body = buildEmailBody(errorInfo, context, getRequestMetadata(req));
    const subject = `CCBC Portal Error${
      context.source ? ` - ${context.source}` : ''
    }`;
    return await sendEmail(
      token,
      body,
      subject,
      [toEmail],
      'error-notification'
    );
  } catch (notifyError) {
    console.error('Failed to send error notification email.', notifyError);
    return null;
  }
};

export const reportServerError = (
  error: unknown,
  context: ErrorNotificationContext = {},
  req?: any
) => {
  if (context.logMessage) {
    console.error(context.logMessage, error);
  } else {
    console.error(context.source || 'Server error', error);
  }
  // eslint-disable-next-line no-void
  void sendErrorNotification(error, context, req);
};
