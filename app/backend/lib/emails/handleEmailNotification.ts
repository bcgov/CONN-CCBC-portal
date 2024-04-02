import getAuthRole from '../../../utils/getAuthRole';
import getAuthUser from '../../../utils/getAuthUser';
import getAccessToken from '../ches/getAccessToken';
import sendEmail from '../ches/sendEmail';

export interface EmailTemplate {
  emailTo: string[];
  tag: string;
  emailCC: string[];
  subject: any;
  body: any;
}

const isAuthorized = (authRole: any) => {
  const authorizedRoles = ['ccbc_admin', 'ccbc_analyst'];
  return authRole && authorizedRoles.includes(authRole.pgRole);
};

const handleEmailNotification = async (
  req,
  res,
  template: (
    applicationId: string,
    host: string,
    eventInitiator: string,
    params: any
  ) => EmailTemplate,
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
    const emailResult = await sendEmail(
      token,
      body,
      subject,
      emailTo,
      tag,
      emailCC
    );
    if (emailResult) {
      return res.status(200).json(emailResult).end();
    }
    return res.status(400).json({ error: 'Failed to send email' }).end();
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' }).end();
  }
};

export default handleEmailNotification;
