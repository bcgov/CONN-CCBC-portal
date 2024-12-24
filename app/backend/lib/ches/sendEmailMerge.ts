import * as Sentry from '@sentry/nextjs';
import getConfig from 'next/config';
import toTitleCase from '../../../utils/formatString';
import config from '../../../config';

const CHES_API_URL = config.get('CHES_API_URL');
const namespace = getConfig()?.publicRuntimeConfig?.OPENSHIFT_APP_NAMESPACE;

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
  const environment = toTitleCase(namespace?.split('-')[1] || 'Dev');
  try {
    const request = {
      bodyType: 'html',
      body,
      contexts,
      encoding: 'utf-8',
      from: `CCBC Portal ${environment !== 'Prod' && environment} <noreply-ccbc-portal@gov.bc.ca>`,
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
