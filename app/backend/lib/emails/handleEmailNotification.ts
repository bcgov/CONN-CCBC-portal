import getConfig from 'next/config';
import getAuthRole from '../../../utils/getAuthRole';
import getAuthUser from '../../../utils/getAuthUser';
import getAccessToken from '../ches/getAccessToken';
import { performQuery } from '../graphql';
import config from '../../../config';
import sendEmail from '../ches/sendEmail';
import sendEmailMerge, { Context } from '../ches/sendEmailMerge';
import { reportServerError } from './errorNotification';

const getAnalystEmailsByIds = `
  query getAnalystEmailsByIds($_rowIds: [Int!]!) {
    allAnalysts(filter: {rowId: {in: $_rowIds}}) {
      edges {
        node {
          email
        }
      }
    }
  }
`;

export interface EmailTemplate {
  emailTo: number[];
  tag: string;
  emailCC: number[];
  subject: any;
  body: any;
  contexts?: Context[];
  params?: any;
}

export interface EmailTemplateProvider {
  (
    applicationId: string,
    host: string,
    eventInitiator?: any,
    params?: any,
    req?: any
  ): EmailTemplate | Promise<EmailTemplate>;
}

const isAuthorized = (authRole: any) => {
  const authorizedRoles = [
    'ccbc_admin',
    'ccbc_analyst',
    'ccbc_auth_user',
    'super_admin',
    'cbc_admin',
    'ccbc_service_account',
  ];
  return authRole && authorizedRoles.includes(authRole.pgRole);
};

const isProd = () => {
  const namespace = getConfig()?.publicRuntimeConfig?.OPENSHIFT_APP_NAMESPACE;
  return namespace?.endsWith('-prod');
};

/**
 * Temporary function to get email recipients from the database based on hardcoded IDs
 * To be replaced with proper email notification system pulls from DB
 */
export const getEmailRecipients = async (req: any, ids: number[]) => {
  if (!isProd() || !ids || ids.length === 0) {
    return [config.get('CHES_TO_EMAIL')];
  }
  const results = await performQuery(
    getAnalystEmailsByIds,
    { _rowIds: ids },
    req
  );
  return results?.data?.allAnalysts?.edges.map((edge) => edge.node.email);
};

export const replaceEmailsInNonProd = (emails: string[]) => {
  if (!isProd() || !emails || emails.length === 0) {
    return [config.get('CHES_TO_EMAIL')];
  }
  return emails;
};

const handleEmailBatch = async (
  res: any,
  subject: any,
  body: any,
  tag: string,
  contexts: any[],
  details: any
) => {
  try {
    const token = await getAccessToken();
    const emailResult = await sendEmailMerge(token, body, subject, contexts);
    if (emailResult) {
      const emailRecordResults = emailResult.messages.map(
        (message: any, i: number) => {
          return {
            messageId: message.msgId,
            to: contexts[i].to,
            cc: contexts[i].cc,
            contexts: contexts[i].context,
            body,
            subject,
          };
        }
      );
      return res.status(200).json({ emailRecordResults, details }).end();
    }
    return res.status(400).json({ error: 'Failed to send email' }).end();
  } catch (error) {
    reportServerError(error, { source: 'handle-email-batch' });
    return res.status(500).json({ error: 'Internal server error' }).end();
  }
};

const sendEmailSingle = async (
  emailTo: number[],
  emailCC: number[],
  req: any,
  res: any,
  subject: any,
  body: any,
  tag: string,
  applicationId: number,
  delayTs: number = 0
) => {
  try {
    const token = await getAccessToken();
    const emailToList = await getEmailRecipients(req, emailTo);
    const emailCCList = await getEmailRecipients(req, emailCC);
    const emailResult = await sendEmail(
      token,
      body,
      subject,
      emailToList,
      tag,
      emailCCList,
      [],
      delayTs,
      req,
      applicationId
    );
    if (emailResult) {
      return res.status(200).json(emailResult).end();
    }
    return res.status(400).json({ error: 'Failed to send email' }).end();
  } catch (error) {
    reportServerError(error, { source: 'send-email-single' });
    return res.status(500).json({ error: 'Internal server error' }).end();
  }
};

const handleEmailNotification = async (
  req,
  res,
  template: EmailTemplateProvider,
  params: any = {},
  isMailMerge = false,
  delayTs = 0
) => {
  if (!isAuthorized(getAuthRole(req))) {
    return res.status(404).end();
  }
  const eventInitiator = getAuthUser(req);
  const { applicationId, host } = req.body;
  const {
    emailTo,
    emailCC,
    tag,
    subject,
    body,
    contexts,
    params: details,
  } = await template(applicationId, host, eventInitiator, params, req);

  if (isMailMerge) {
    return handleEmailBatch(res, subject, body, tag, contexts, details);
  }
  return sendEmailSingle(
    emailTo,
    emailCC,
    req,
    res,
    subject,
    body,
    tag,
    applicationId,
    delayTs
  );
};

export default handleEmailNotification;
