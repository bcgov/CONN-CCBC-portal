import getConfig from 'next/config';
import config from '../../../config';
import toTitleCase from '../../../utils/formatString';
import { recordEmailRecord } from '../emails/utils/emailRecord';
import { reportServerError } from '../emails/errorNotification';

const CHES_API_URL = config.get('CHES_API_URL');

const sendEmail = async (
  token: string,
  body: string,
  subject: string,
  emailTo: string[] | string,
  tag: string,
  emailCC: string[] | string = [],
  attachments: {
    content: string;
    filename: string;
    encoding: string;
    contentType: string;
  }[] = [],
  delayTs: number = 0,
  req: any = null,
  applicationId: number | null = null
) => {
  const namespace = getConfig()?.publicRuntimeConfig?.OPENSHIFT_APP_NAMESPACE;
  const environment = toTitleCase(namespace?.split('-')[1] || '');
  try {
    const request = {
      bodyType: 'html',
      body,
      cc: emailCC,
      delayTS: delayTs,
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
    // if a req has been passed, we can log the email record
    if (req !== null && applicationId !== null) {
      const input = {
        emailRecord: {
          ccEmail: typeof emailCC === 'string' ? emailCC : emailCC.join(','),
          toEmail: typeof emailTo === 'string' ? emailTo : emailTo.join(','),
          subject,
          body,
          messageId: sendEmailResult.messages[0].msgId,
          jsonData: {
            tag,
            applicationId,
            fullResult: sendEmailResult,
            isDelayed: delayTs > 0,
            isCancelled: false,
          },
        },
      };
      await recordEmailRecord(input, req);
    }
    return sendEmailResult.messages[0].msgId;
  } catch (error: any) {
    reportServerError(error, { source: 'sendEmail' });
    throw new Error(error.message);
  }
};

export default sendEmail;
