import { performQuery } from '../../graphql';
import { Context } from '../../ches/sendEmailMerge';
import {
  EmailTemplate,
  EmailTemplateProvider,
  replaceEmailsInNonProd,
} from '../handleEmailNotification';

const getAnalystInfoByUserIds = `
  query getAnalystNameByUserIds($_rowIds: [Int!]!) {
    allAnalysts(filter: {rowId: {in: $_rowIds}}) {
        nodes {
          email
          givenName
        }
    }
  }
`;
const getEmails = async (ids: number[], req: any) => {
  const results = await performQuery(
    getAnalystInfoByUserIds,
    { _rowIds: ids },
    req
  );
  return results?.data?.allAnalysts.nodes;
};

const notifyMilestoneReportDue: EmailTemplateProvider = async (
  applicationId: string,
  url: string,
  initiator: any,
  params: any,
  req
): Promise<EmailTemplate> => {
  const { milestoneReportData } = params;
  const recipients = [70, 71];

  const emails = await getEmails(recipients, req);

  const contexts = emails.map((email) => {
    const { givenName, email: recipientEmail } = email;
    const emailTo = replaceEmailsInNonProd([recipientEmail]);
    const emailCC = replaceEmailsInNonProd([]);
    return {
      to: emailTo,
      cc: emailCC,
      context: {
        recipientName: givenName,
        milestones: milestoneReportData,
      },
      delayTS: 0,
      tag: 'milestone-due',
    } as Context;
  });

  const subject = `Reminder: Milestone Report${milestoneReportData.length > 1 ? 's' : ''} ${milestoneReportData.length > 1 ? 'are' : 'is'} coming Due`;

  return {
    emailTo: [],
    emailCC: [],
    tag: 'milestone-due',
    subject,
    body: `
        <p>Hi {{ recipientName | trim }} </p>
        <p>This is a notification to let you know that one or more Milestone Reports are coming due in 30 days: <p>
        <ul>
          {% for milestone in milestones %}
          <li>Milestone {{ milestone.milestoneNumber }} for {{ milestone.organizationName | trim }}. Project: {{ milestone.ccbcNumber }}. Due {{ milestone.milestoneDate }}</li>
          {% endfor %}
        </ul>
        <p>To unsubscribe from these email notifications, email meherzad.romer@gov.bc.ca</p>
      `,
    contexts,
    params: { milestoneReportData },
  };
};

export default notifyMilestoneReportDue;
