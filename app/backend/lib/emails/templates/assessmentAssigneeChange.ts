import { Context } from 'backend/lib/ches/sendEmailMerge';
import ASSESSMENT_TYPES from '../../../../data/assessmentTypes';
import {
  EmailTemplate,
  EmailTemplateProvider,
  replaceEmailsInNonProd,
} from '../handleEmailNotification';
import { performQuery } from '../../graphql';

const getCCBCUsersByIds = `
  query getCCBCUsersByIds($_rowIds: [Int!]!) {
    allCcbcUsers(filter: {rowId: {in: $_rowIds}}) {
      edges {
        node {
          rowId
          givenName
        }
      }
    }
  }
`;

// Return users by their row IDs
const getUsers = async (ids: number[], req: any) => {
  const results = await performQuery(getCCBCUsersByIds, { _rowIds: ids }, req);
  return results?.data?.allCcbcUsers?.edges.reduce((acc, user) => {
    acc[user.node.rowId] = user.node.givenName;
    return acc;
  }, {});
};

const getGroupedContentList = (assessments: any[], property: string) => {
  const grouped = {};
  return assessments.reduce((result, item) => {
    const key = item[property];
    if (!result[key]) {
      grouped[key] = [];
    }
    grouped[key].push(item);
    return grouped;
  }, {});
};

const assessmentAssigneeChange: EmailTemplateProvider = async (
  applicationId: string,
  url: string,
  initiator: string,
  params: any,
  req?: any
): Promise<EmailTemplate> => {
  const assessmentsGrouped = getGroupedContentList(
    params.assignments,
    'assigneeEmail'
  );

  /**
   * Group the notification content for each assignee
   * So we do not send multiple emails but grouped notifications
   */
  const request = Object.entries(assessmentsGrouped).map(
    async ([assignee, assessments]) => {
      const emailTo = replaceEmailsInNonProd([assignee]);
      const emailCC = replaceEmailsInNonProd([]);

      /**
       * Group each list of assignments by the assignor
       */
      const assignmentsByAssignor = getGroupedContentList(
        assessments as Array<any>,
        'updatedBy'
      );
      const ccbcAssignorUserList = await getUsers(
        Object.keys(assignmentsByAssignor).map((key) => Number(key)),
        req
      );
      const actions = Object.entries(assignmentsByAssignor).map(
        ([assignor, assignments]) => {
          const alerts = (assignments as Array<any>).map((assignment) => {
            return {
              url: `${url}/analyst/application/${assignment.applicationId}/assessments/${ASSESSMENT_TYPES[assignment.assessmentType].slug}`,
              type: ASSESSMENT_TYPES[assignment.assessmentType].type,
              ccbcNumber: assignment.ccbcNumber,
              applicationId: assignment.applicationId,
            };
          });
          return {
            assignors: ccbcAssignorUserList[assignor],
            alerts,
          };
        }
      );
      // Get the list of assignors for the email
      const assignorList = Object.keys(assignmentsByAssignor).map(
        (key) => ccbcAssignorUserList[key]
      );

      return {
        to: emailTo,
        cc: emailCC,
        context: {
          assignee,
          assignorList,
          actions,
        },
        delayTS: 0,
        tag: 'assignment-assignee-change',
      } as Context;
    }
  );

  const contexts = await Promise.all(request);

  return {
    emailTo: [],
    emailCC: [],
    tag: 'assignment-assignee-change',
    subject: `{% if assignorList.length > 1 %}
            {{ assignorList | slice(2) | join(", ") }} and others has(/have) assigned you one or more assessment(s)
            {% else %} {{ assignorList | join(" ") }} has assigned you one or more assessment(s)
            {% endif %}`,
    body: `{% for action in actions %}
            {{ action.assignors }} has assigned you the following assessment(s):
            <ul>{% for alert in action.alerts %}
              <li><a href='{{ alert.url }}'>{{ alert.type }}</a> for {{ alert.ccbcNumber }}</li>
            {% endfor %}</ul>
          {% endfor %}`,
    contexts,
    params: { assessmentsGrouped },
  };
};

export default assessmentAssigneeChange;
