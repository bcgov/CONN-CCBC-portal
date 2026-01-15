import { Router } from 'express';
import RateLimit from 'express-rate-limit';
import getAuthRole from '../../utils/getAuthRole';
import { performQuery } from './graphql';
import handleEmailNotification from './emails/handleEmailNotification';
import notifyMilestoneReportDue from './emails/templates/notifyMilestoneReportDue';
import validateKeycloakToken from './keycloakValidate';
import { reportServerError } from './emails/errorNotification';

const limiter = RateLimit({
  windowMs: 1 * 60 * 1000,
  max: 30,
});

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
    reportServerError(error, { source: 'milestone-due-query' }, req);
    return res.status(500).json({ error: result.error }).end();
  }

  const today = new Date();
  // Function to check if a given due date string is within 30 to 31 days from today.
  const isWithin30To31Days = (dueDateStr) => {
    const dueDate = new Date(dueDateStr);
    today.setHours(0, 0, 0, 0);
    const timeDiff = dueDate.getTime() - today.getTime();
    const daysDiff = Math.round(timeDiff / (1000 * 3600 * 24));
    return daysDiff === 30;
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
      const milestoneOneDue = milestoneData.find((milestone) => {
        return isWithin30To31Days(milestone.milestone1);
      });
      const milestoneTwoDue = milestoneData.find((milestone) => {
        return isWithin30To31Days(milestone.milestone2);
      });
      const milestoneThreeDue = milestoneData.find((milestone) => {
        return isWithin30To31Days(milestone.milestone3);
      });
      if (milestoneOneDue) {
        const applicationRowId = applicationId;
        if (!applicationRowIdsVisited.has(applicationRowId)) {
          acc.push({
            applicationRowId,
            ccbcNumber,
            organizationName,
            projectName,
            milestoneNumber: '1',
            milestoneDate: new Date(
              milestoneOneDue.milestone1
            ).toLocaleDateString(),
          });
        }
      }
      if (milestoneTwoDue) {
        const applicationRowId = applicationId;
        if (!applicationRowIdsVisited.has(applicationRowId)) {
          acc.push({
            applicationRowId,
            ccbcNumber,
            organizationName,
            projectName,
            milestoneNumber: '2',
            milestoneDate: new Date(
              milestoneTwoDue.milestone2
            ).toLocaleDateString(),
          });
        }
      }
      if (milestoneThreeDue) {
        const applicationRowId = applicationId;
        if (!applicationRowIdsVisited.has(applicationRowId)) {
          acc.push({
            applicationRowId,
            ccbcNumber,
            organizationName,
            projectName,
            milestoneNumber: '3',
            milestoneDate: new Date(
              milestoneThreeDue.milestone3
            ).toLocaleDateString(),
          });
        }
      }
      if (milestoneThreeDue || milestoneOneDue || milestoneTwoDue) {
        applicationRowIdsVisited.add(applicationId);
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

milestonesRouter.get('/api/analyst/milestone/upcoming', limiter, (req, res) => {
  const authRole = getAuthRole(req);
  const isRoleAuthorized =
    authRole?.pgRole === 'ccbc_admin' || authRole?.pgRole === 'super_admin';

  if (!isRoleAuthorized) {
    return res.status(404).end();
  }
  return processMilestones(req, res);
});

milestonesRouter.get(
  '/api/analyst/cron-milestones',
  limiter,
  validateKeycloakToken,
  (req, res) => {
    req.claims.identity_provider = 'serviceaccount';
    processMilestones(req, res);
  }
);

export default milestonesRouter;
