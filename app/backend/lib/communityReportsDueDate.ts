import { Router } from 'express';
import RateLimit from 'express-rate-limit';
import getConfig from 'next/config';
import getAuthRole from '../../utils/getAuthRole';
import { performQuery } from './graphql';
import handleEmailNotification from './emails/handleEmailNotification';
import notifyCommunityReportDue from './emails/templates/notifyCommunityReportDue';
import validateKeycloakToken from './keycloakValidate';
import { reportServerError } from './emails/errorNotification';

const limiter = RateLimit({
  windowMs: 1 * 60 * 1000,
  max: 30,
});

const communityReportDueDate = Router();

function getNextQuarterStartDate(today: Date): Date {
  const currentYear = today.getFullYear();
  // Define quarter start months: March, June, September, December
  const quarterStartMonths = [2, 5, 8, 11]; // 0-based: 2=March, 5=June, 8=September, 11=December

  const currentQuarterStartMonth = quarterStartMonths.find((month) => {
    const quarterStartDate = new Date(currentYear, month, 1, 0, 0, 0, 0);
    return quarterStartDate > today;
  });

  if (currentQuarterStartMonth !== undefined) {
    return new Date(currentYear, currentQuarterStartMonth, 1, 0, 0, 0, 0);
  }
  // If no quarter start date is after today in the current year, return March 1 of next year
  return new Date(currentYear + 1, 2, 1, 0, 0, 0, 0); // 2=March
}

const processCommunityReportsDueDates = async (req, res) => {
  const runtimeConfig = getConfig()?.publicRuntimeConfig ?? {};
  const isEnabledTimeMachine = runtimeConfig.ENABLE_MOCK_TIME;
  // GraphQL query to get all milestones with archivedAt: null
  const sowCommunityProgressQuery = `
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
          jsonData
        }
      }
    }
  `;
  let result;
  const applicationRowIdsVisited = new Set();

  try {
    result = await performQuery(sowCommunityProgressQuery, {}, req);
  } catch (error) {
    reportServerError(error, { source: 'community-reports-due-query' }, req);
    return res.status(500).json({ error: result.error }).end();
  }
  let today = null;
  if (isEnabledTimeMachine) {
    const mockedDate = req.cookies['mocks.mocked_date'];
    today = mockedDate ? new Date(mockedDate) : new Date();
    today.setUTCHours(0, 0, 0, 0);
  } else {
    today = new Date();
    today.setUTCHours(0, 0, 0, 0);
  }
  const nextQuarterDate = getNextQuarterStartDate(today);

  // Function to check if a given due date string is within 30 to 31 days from today.
  const isWithin30To31Days = (dueDate: Date) => {
    const timeDiff = dueDate.getTime() - today.getTime();
    const daysDiff = Math.round(timeDiff / (1000 * 3600 * 24));
    return daysDiff === 30;
  };

  // Traverse the result, if there is a milestone due date within 30 to 31 days from today,
  // add the application row ID, CCBC number, and whether it is a milestone 1 or 2 to a list.
  const communityReportData = result.data.allApplicationSowData.nodes.reduce(
    (acc, node) => {
      const { applicationId, applicationByApplicationId, jsonData } = node;
      if (applicationRowIdsVisited.has(applicationId)) {
        return acc;
      }
      const { ccbcNumber, organizationName, projectName } =
        applicationByApplicationId;

      const projectStartDateString = jsonData.projectStartDate;

      const projectStartDate = new Date(projectStartDateString);

      if (today.getTime() > projectStartDate.getTime()) {
        if (isWithin30To31Days(nextQuarterDate)) {
          const applicationRowId = applicationId;
          if (!applicationRowIdsVisited.has(applicationRowId)) {
            acc.push({
              applicationRowId,
              ccbcNumber,
              organizationName,
              projectName,
              dueDate: nextQuarterDate.toLocaleDateString(),
            });
            applicationRowIdsVisited.add(applicationRowId);
          }
        }
      }
      return acc;
    },
    []
  );

  if (communityReportData.length > 0) {
    // Send an email to the analyst with the list of applications that have milestones due within 30 to 31 days.
    return handleEmailNotification(
      req,
      res,
      notifyCommunityReportDue,
      { communityReportData },
      true
    );
  }

  return res
    .status(200)
    .json({ message: 'No community progress reports due in 30 days' })
    .end();
};

communityReportDueDate.get(
  '/api/analyst/community/upcoming',
  limiter,
  (req, res) => {
    const authRole = getAuthRole(req);
    const isRoleAuthorized =
      authRole?.pgRole === 'ccbc_admin' || authRole?.pgRole === 'super_admin';

    if (!isRoleAuthorized) {
      return res.status(404).end();
    }
    return processCommunityReportsDueDates(req, res);
  }
);

communityReportDueDate.get(
  '/api/analyst/cron-community',
  limiter,
  validateKeycloakToken,
  (req, res) => {
    req.claims.identity_provider = 'serviceaccount';
    processCommunityReportsDueDates(req, res);
  }
);

export default communityReportDueDate;
