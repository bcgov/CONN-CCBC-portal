import NextError from 'next/error';
import type { NextPageContext } from 'next';
import reportClientError from 'lib/helpers/reportClientError';

const CustomErrorComponent = (props) => {
  // eslint-disable-next-line react/destructuring-assignment
  return <NextError statusCode={props.statusCode} />;
};

CustomErrorComponent.getInitialProps = async (
  contextData: NextPageContext & { err?: Error | null }
) => {
  const error =
    contextData?.err instanceof Error
      ? contextData.err
      : new globalThis.Error('Unexpected error in _error handler');
  if (contextData?.req) {
    console.error('next-error-page', error);
    const {req} = contextData;
    try {
      const payload = {
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack,
        },
        context: {
          source: 'next-error-page',
          metadata: {
            statusCode: contextData?.res?.statusCode,
            pathname: contextData?.pathname,
          },
        },
        location: req?.url,
        userAgent: req?.headers?.['user-agent'],
      };
      await fetch('/api/email/notifyError', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch (notifyError) {
      console.error('Failed to notify error email', notifyError);
    }
  } else {
    reportClientError(error, {
      source: 'next-error-page',
      metadata: {
        statusCode: contextData?.res?.statusCode,
        pathname: contextData?.pathname,
      },
    });
  }

  // This will contain the status code of the response
  return NextError.getInitialProps(contextData);
};

export default CustomErrorComponent;
