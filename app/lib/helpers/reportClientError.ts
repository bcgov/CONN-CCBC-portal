export interface ClientErrorContext {
  source?: string;
  metadata?: Record<string, unknown>;
}

const safeStringify = (value: unknown) => {
  try {
    return JSON.stringify(value);
  } catch (stringifyError) {
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

  return {
    name: 'NonError',
    message: safeStringify(error),
    stack: undefined,
  };
};

const notifyError = async (error: unknown, context: ClientErrorContext = {}) => {
  if (process.env.NODE_ENV === 'test') {
    return;
  }

  if (typeof window === 'undefined') {
    return;
  }

  const payload = {
    error: normalizeError(error),
    context,
    location: window.location.href,
    userAgent: window.navigator.userAgent,
  };

  try {
    await fetch('/api/email/notifyError', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (notifyErrorErr) {
    console.error('Failed to send error notification.', notifyErrorErr);
  }
};

const reportClientError = (
  error: unknown,
  context: ClientErrorContext = {}
) => {
  console.error(context.source || 'Client error', error);
  // eslint-disable-next-line no-void
  void notifyError(error, context);
};

export default reportClientError;
