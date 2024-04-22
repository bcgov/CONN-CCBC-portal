import * as Sentry from '@sentry/nextjs';
import config from '../../../config';

const CHES_API_URL = config.get('CHES_API_URL');

export interface Context {
  to: string[];
  cc: string[];
  context: { [key: string]: any };
  delayTS: number;
  tag: string;
}

type Contexts = Context[];

const sendEmailMerge = async (
  token: string,
  body: string,
  subject: string,
  contexts: Contexts
) => {
  try {
    const request = {
      bodyType: 'html',
      body,
      contexts,
      encoding: 'utf-8',
      from: 'CCBC Portal <noreply-ccbc-portal@gov.bc.ca>',
      priority: 'normal',
      subject,
      attachments: [],
    };
    const response = await fetch(`${CHES_API_URL}/api/v1/emailMerge`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });
    if (!response.ok) {
      throw new Error(`Error sending merge with status: ${response.status}`);
    }
    const sendEmailResult = await response.json();
    return sendEmailResult;
  } catch (error: any) {
    Sentry.captureException(new Error(error.message));
    throw new Error(error.message);
  }
};

export default sendEmailMerge;
