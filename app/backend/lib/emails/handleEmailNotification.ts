import getConfig from 'next/config';
import getAuthRole from '../../../utils/getAuthRole';
import getAuthUser from '../../../utils/getAuthUser';
import getAccessToken from '../ches/getAccessToken';
import { performQuery } from '../graphql';
import config from '../../../config';
import sendEmail from '../ches/sendEmail';

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
}

export interface EmailTemplateProvider {
  (
    applicationId: string,
    host: string,
    eventInitiator?: any,
    params?: any
  ): EmailTemplate;
}

const isAuthorized = (authRole: any) => {
  const authorizedRoles = ['ccbc_admin', 'ccbc_analyst'];
  return authRole && authorizedRoles.includes(authRole.pgRole);
};

/**
 * Temporary function to get email recipients from the database based on hardcoded IDs
 * To be replaced with proper email notification system pulls from DB
 */
const getEmailRecipients = async (ids: number[], req: any) => {
  const publicRuntimeConfig = getConfig()?.publicRuntimeConfig;
  const namespace = publicRuntimeConfig?.OPENSHIFT_APP_NAMESPACE;
  const isProd = namespace?.endsWith('-prod');
  if (!isProd || !ids || ids.length === 0) {
    return [config.get('CHES_TO_EMAIL')];
  }

  const results = await performQuery(
    getAnalystEmailsByIds,
    { _rowIds: ids },
    req
  );
  return results?.data?.allAnalysts?.edges.map((edge) => edge.node.email);
};

const handleEmailNotification = async (
  req,
  res,
  template: EmailTemplateProvider,
  params: any = {}
) => {
  if (!isAuthorized(getAuthRole(req))) {
    return res.status(404).end();
  }
  const eventInitiator = getAuthUser(req);

  const { applicationId, host } = req.body;
  const { emailTo, emailCC, tag, subject, body } = template(
    applicationId,
    host,
    eventInitiator,
    params
  );

  try {
    const token = await getAccessToken();
    const emailToList = await getEmailRecipients(emailTo, req);
    const emailCCList = await getEmailRecipients(emailCC, req);
    const emailResult = await sendEmail(
      token,
      body,
      subject,
      emailToList,
      tag,
      emailCCList
    );
    if (emailResult) {
      return res.status(200).json(emailResult).end();
    }
    return res.status(400).json({ error: 'Failed to send email' }).end();
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' }).end();
  }
};

export { handleEmailNotification, getEmailRecipients };
