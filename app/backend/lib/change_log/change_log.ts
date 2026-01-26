import { Router } from 'express';
import RateLimit from 'express-rate-limit';
import { performQuery } from '../graphql';
import { gbClient } from '../growthbook-client';
import { reportServerError } from '../emails/errorNotification';

const changeLog = Router();

const limiter = RateLimit({
  windowMs: 1 * 60 * 1000,
  max: 2000,
});

const generateQuery = (
  limitCount = 99999,
  offsetCount = 0,
  exclude_ccbc = false
) => {
  return `
    query allChangeLog {
      changeLog(limitCount: ${limitCount}, offsetCount: ${offsetCount}, ${exclude_ccbc ? 'filter: {tableName: {in: "cbc_data"}}' : ''}) {
        nodes {
          rowId
          recordId
          oldRecordId
          op
          ts
          tableOid
          tableSchema
          tableName
          createdBy
          createdAt
          record
          oldRecord
          program
          applicationId
          ccbcNumber
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
      featureValue?.limitCount,
      featureValue?.offsetCount,
      featureValue?.exclude_ccbc
    );

    const changeLogData = await performQuery(query, {}, req);
    // Separate the change log data into cbc and ccbc based on table_name
    const allCbcs: any[] = [];
    const allApplications: any[] = [];

    changeLogData.data.changeLog.nodes.forEach((node: any) => {
      if (node.tableName === 'cbc_data') {
        allCbcs.push(node);
      } else {
        allApplications.push(node);
      }
    });

    const responseData = {
      feature: flag,
      value: featureValue,
      query,
      data: { allCbcs, allApplications },
      success: true,
    };

    // Generate ETag based on data content
    const crypto = await import('crypto');
    const etag = crypto
      .createHash('md5')
      .update(JSON.stringify(responseData.data))
      .digest('hex');

    // Check if client has the same ETag
    const clientETag = req.headers['if-none-match'];
    if (clientETag === etag) {
      return res.status(304).end();
    }

    // Set cache headers
    res.set({
      ETag: etag,
      'Cache-Control': 'private, max-age=300', // Cache for 5 minutes
      'Last-Modified': new Date().toUTCString(),
    });

    // Return the feature value
    return res.json(responseData);
  } catch (error) {
    reportServerError(error, { source: 'change-log' }, req);
    return res.status(500).json({
      error,
      success: false,
    });
  }
});

export default changeLog;
