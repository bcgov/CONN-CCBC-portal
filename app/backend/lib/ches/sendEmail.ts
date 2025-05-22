import * as Sentry from '@sentry/nextjs';
import getConfig from 'next/config';
import config from '../../../config';
import toTitleCase from '../../../utils/formatString';

const CHES_API_URL = config.get('CHES_API_URL');

const sendEmail = async (
  token: string,
  body: string,
  subject: string,
  emailTo: string[],
  tag: string,
  emailCC: string[] = [],
  attachments: {
    content: string;
    filename: string;
    encoding: string;
    contentType: string;
  }[] = []
) => {
  const namespace = getConfig()?.publicRuntimeConfig?.OPENSHIFT_APP_NAMESPACE;
  const environment = toTitleCase(namespace?.split('-')[1] || '');
  try {
    const request = {
      bodyType: 'html',
      body,
      cc: emailCC,
      delayTs: 0,
      encoding: 'utf-8',
      from: `CCBC Portal ${environment} <noreply-ccbc-portal@gov.bc.ca>`,
      priority: 'normal',
      subject,
      to: emailTo,
      tag: `ccbc-portal-email-${tag}`,
      attachments: attachments.map((attachment) => ({
        content: attachment.content,
        filename: attachment.filename,
        encoding: attachment.encoding,
        contentType: attachment.contentType,
      })),
    };
    const response = await fetch(`${CHES_API_URL}/api/v1/email`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });
    if (!response.ok) {
      throw new Error(`Error sending email with status: ${response.status}`);
    }
    const sendEmailResult = await response.json();
    return sendEmailResult.messages[0].msgId;
  } catch (error: any) {
    Sentry.captureException(new Error(error.message));
    throw new Error(error.message);
  }
};

export default sendEmail;
