import { Router } from 'express';
import RateLimit from 'express-rate-limit';
import { performQuery } from '../graphql';
import { gbClient } from '../growthbook-client';

const changeLog = Router();

const limiter = RateLimit({
  windowMs: 1 * 60 * 1000,
  max: 2000,
});

const generateQuery = (
  cbc_to_show = 100,
  cbc_order = 'UPDATED_AT_DESC',
  cbc_offset = 0,
  history_items_per_cbc = 100,
  ccbc_to_show = 100,
  ccbc_order = 'UPDATED_AT_DESC',
  ccbc_offset = 0,
  history_items_per_ccbc = 100
) => {
  return `
  query allChangeLog {
      allCbcs(first: ${cbc_to_show}, orderBy: ${cbc_order}, offset: ${cbc_offset}) {
    nodes {
      rowId
      projectNumber
      history(first: ${history_items_per_cbc}) {
        nodes {
          op
          createdAt
          createdBy
          id
          record
          oldRecord
          tableName
          ccbcUserByCreatedBy {
            givenName
            familyName
          }
        }
      }
    }
  }
  allApplications(first: ${ccbc_to_show}, orderBy: ${ccbc_order}, offset: ${ccbc_offset}) {
    nodes {
      rowId
      ccbcNumber
      program
      history(first: ${history_items_per_ccbc}) {
        nodes {
          applicationId
          createdAt
          createdBy
          externalAnalyst
          familyName
          item
          givenName
          op
          record
          oldRecord
          recordId
          sessionSub
          tableName
        }
      }
      ccbcUserByCreatedBy {
        familyName
        givenName
      }
    }
  }
}
`;
};

changeLog.get('/api/change-log', limiter, async (req, res) => {
  const flag = 'change_log_variables';
  try {
    // refresh and get feature value from GrowthBook
    await gbClient.refreshFeatures();
    const featureValue: any = gbClient.getFeatureValue(flag, false, {});

    // generate the query based on the feature flag
    const query = generateQuery(
      featureValue.cbc_to_show,
      featureValue.cbc_order,
      featureValue.cbc_offset,
      featureValue.history_items_per_cbc,
      featureValue.ccbc_to_show,
      featureValue.ccbc_order,
      featureValue.ccbc_offset,
      featureValue.history_items_per_ccbc
    );

    const changeLogData = await performQuery(query, {}, req);

    // Return the feature value
    res.json({
      feature: flag,
      value: featureValue,
      query,
      data: changeLogData.data,
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      error,
      success: false,
    });
  }
});

export default changeLog;
