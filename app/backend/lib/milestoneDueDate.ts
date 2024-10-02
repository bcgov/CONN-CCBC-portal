import { Router } from 'express';
import getAuthRole from '../../utils/getAuthRole';
import { performQuery } from './graphql';
import handleEmailNotification from './emails/handleEmailNotification';
import notifyMilestoneReportDue from './emails/templates/notifyMilestoneReportDue';
import validateKeycloakToken from './keycloakValidate';

const milestonesRouter = Router();

const processMilestones = async (req, res) => {
  // GraphQL query to get all milestones with archivedAt: null
  const sowMilestoneQuery = `
    query MilestoneDatesQuery {
      allApplicationSowData(
        orderBy: AMENDMENT_NUMBER_DESC
        filter: {archivedAt: {isNull: true}}
      ) {
        nodes {
          amendmentNumber
          applicationId
          applicationByApplicationId {
            ccbcNumber
            organizationName
            projectName
          }
          sowTab2SBySowId(
            first: 1
            orderBy: ID_DESC
            filter: {archivedAt: {isNull: true}}
          ) {
            nodes {
              jsonData
            }
          }
        }
      }
    }
  `;
  let result;
  const applicationRowIdsVisited = new Set();

  try {
    result = await performQuery(sowMilestoneQuery, {}, req);
  } catch (error) {
    return res.status(500).json({ error: result.error }).end();
  }

  const today = new Date();
  // Function to check if a given due date string is within 30 to 31 days from today.
  const isWithin30To31Days = (dueDateStr) => {
    const dueDate = new Date(dueDateStr);
    const timeDiff = dueDate.getTime() - today.getTime();
    const daysDiff = timeDiff / (1000 * 3600 * 24);
    return daysDiff >= 30 && daysDiff <= 31;
  };

  // Traverse the result, if there is a milestone due date within 30 to 31 days from today,
  // add the application row ID, CCBC number, and whether it is a milestone 1 or 2 to a list.
  const milestoneReportData = result.data.allApplicationSowData.nodes.reduce(
    (acc, node) => {
      const { applicationId, applicationByApplicationId, sowTab2SBySowId } =
        node;
      if (applicationRowIdsVisited.has(applicationId)) {
        return acc;
      }
      const { ccbcNumber, organizationName, projectName } =
        applicationByApplicationId;
      const milestoneData: Array<any> = sowTab2SBySowId.nodes[0]
        ?.jsonData as Array<any>;
      const milestoneDue = milestoneData.find(
        (milestone) =>
          isWithin30To31Days(milestone.milestone1) ||
          isWithin30To31Days(milestone.milestone2)
      );
      if (milestoneDue) {
        const applicationRowId = applicationId;
        if (!applicationRowIdsVisited.has(applicationRowId)) {
          acc.push({
            applicationRowId,
            ccbcNumber,
            organizationName,
            projectName,
            milestoneNumber: isWithin30To31Days(milestoneDue.milestone1)
              ? '1'
              : '2',
            milestoneDate: isWithin30To31Days(milestoneDue.milestone1)
              ? new Date(milestoneDue.milestone1).toLocaleDateString()
              : new Date(milestoneDue.milestone2).toLocaleDateString(),
          });
          applicationRowIdsVisited.add(applicationRowId);
        }
      }
      return acc;
    },
    []
  );

  if (milestoneReportData.length > 0) {
    // Send an email to the analyst with the list of applications that have milestones due within 30 to 31 days.
    return handleEmailNotification(
      req,
      res,
      notifyMilestoneReportDue,
      { milestoneReportData },
      true
    );
  }

  return res
    .status(200)
    .json({ message: 'No milestones due in 30 days' })
    .end();
};

milestonesRouter.get('/api/analyst/milestones/upcoming', (req, res) => {
  const authRole = getAuthRole(req);
  const isRoleAuthorized =
    authRole?.pgRole === 'cbc_admin' || authRole?.pgRole === 'super_admin';

  if (!isRoleAuthorized) {
    return res.status(404).end();
  }
  return processMilestones(req, res);
});

milestonesRouter.get(
  '/api/analyst/cron-milestones',
  validateKeycloakToken,
  (req, res) => {
    req.claims.identity_provider = 'serviceaccount';
    processMilestones(req, res);
  }
);

export default milestonesRouter;
