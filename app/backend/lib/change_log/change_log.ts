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

const fetchCachedChangeLog = async (req) => {
  const query = `
    query CachedChangeLogData {
      allChangeLogData(first: 1, orderBy: UPDATED_AT_DESC) {
        nodes {
          rowId
          jsonData
          updatedAt
        }
      }
    }
  `;

  const response = await performQuery(query, {}, req);
  const node = response?.data?.allChangeLogData?.nodes?.[0];

  if (!node) return null;

  return {
    rowId: node.rowId,
    data: node.jsonData,
    updatedAt: node.updatedAt,
  };
};

const writeChangeLogCache = async (
  data: { allCbcs: any[]; allApplications: any[] },
  req,
  rowId?: number
) => {
  if (rowId) {
    const mutation = `
      mutation UpdateChangeLogData($rowId: Int!, $data: JSON!) {
        updateChangeLogDataByRowId(
          input: { rowId: $rowId, changeLogDataPatch: { jsonData: $data } }
        ) {
          changeLogData {
            updatedAt
          }
        }
      }
    `;

    const response = await performQuery(mutation, { rowId, data }, req);
    return response?.data?.updateChangeLogDataByRowId?.changeLogData?.updatedAt;
  }

  const mutation = `
    mutation CreateChangeLogData($data: JSON!) {
      createChangeLogData(input: { changeLogData: { jsonData: $data } }) {
        changeLogData {
          rowId
          updatedAt
        }
      }
    }
  `;

  const response = await performQuery(mutation, { data }, req);
  return response?.data?.createChangeLogData?.changeLogData?.updatedAt;
};

const generateChangeLogData = async (req) => {
  const flag = 'change_log_variables';
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

  return { allCbcs, allApplications };
};

changeLog.get('/api/change-log', limiter, async (req, res) => {
  try {
    const cached = await fetchCachedChangeLog(req);
    if (cached) {
      return res.json({
        data: cached.data,
        updatedAt: cached.updatedAt,
        success: true,
        source: 'cache',
      });
    }

    const data = await generateChangeLogData(req);
    const updatedAt = await writeChangeLogCache(data, req);

    return res.json({
      data,
      updatedAt,
      success: true,
      source: 'generated',
    });
  } catch (error) {
    reportServerError(error, { source: 'change-log' }, req);
    return res.status(500).json({
      error,
      success: false,
    });
  }
});

changeLog.get('/api/change-log/refresh', limiter, async (req, res) => {
  try {
    const cached = await fetchCachedChangeLog(req);
    const cachedData = cached?.data as
      | { allCbcs: any[]; allApplications: any[] }
      | undefined;
    const cachedCount = cachedData
      ? cachedData.allCbcs.length + cachedData.allApplications.length
      : 0;

    const freshData = await generateChangeLogData(req);
    const freshCount =
      freshData.allCbcs.length + freshData.allApplications.length;

    if (!cachedData || freshCount !== cachedCount) {
      const updatedAt = await writeChangeLogCache(
        freshData,
        req,
        cached?.rowId
      );
      return res.json({
        hasUpdates: Boolean(cachedData),
        updatedAt,
        success: true,
      });
    }

    return res.json({
      hasUpdates: false,
      updatedAt: cached?.updatedAt ?? null,
      success: true,
    });
  } catch (error) {
    reportServerError(error, { source: 'change-log-refresh' }, req);
    return res.status(500).json({
      error,
      success: false,
    });
  }
});

export default changeLog;
