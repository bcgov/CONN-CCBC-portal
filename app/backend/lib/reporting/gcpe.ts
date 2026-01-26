import writeXlsxFile, { Row } from 'write-excel-file';
import { DateTime } from 'luxon';
import generateFormData, {
  getConditionalApprovalDate,
  getFundingData,
} from '../../../lib/helpers/ccbcSummaryGenerateFormData';
import { performQuery } from '../graphql';
import {
  CHANGE_LOG_HEADER_CELL,
  HEADER_ROW,
  HEADER_ROW_WITH_CHANGE_LOG,
} from './header';
import columnOptions, { columnOptionsWithChangeLog } from './column_options';
import {
  cleanDateTime,
  compareAndMarkArrays,
  convertBoolean,
  convertStatus,
  findPrimaryAnnouncement,
  findPrimaryAnnouncementDate,
  findSecondaryAnnouncement,
  handleProjectType,
  handleCbcEconomicRegions,
  getCCBCFederalFundingSource,
  getFundingSource,
} from './util';
import toTitleCase from '../../../utils/formatString';
import { getFnhaValue } from '../dashboard/util';

const getCbcDataQuery = `
  query getCbcData {
    allCbcData (
      filter: {cbcByCbcId: {archivedAt: {isNull: true}}}
      orderBy: PROJECT_NUMBER_ASC
    ) {
      edges {
        node {
          projectNumber
          jsonData
          cbcByCbcId {
            cbcProjectCommunitiesByCbcId(
              filter: { archivedAt: { isNull: true } }
            ) {
              nodes {
                communitiesSourceDataByCommunitiesSourceDataId {
                  economicRegion
                }
              }
            }
            cbcApplicationPendingChangeRequestsByCbcId(
              last: 1
              filter: { archivedAt: { isNull: true } }
            ) {
              edges {
                node {
                  isPending
                }
              }
            }
          }
        }
      }
    }
  }
`;

const getCcbcQuery = `
    query getCcbc {
      allApplications(
        filter: {analystStatus: {in: ["conditionally_approved", "approved", "on_hold", "closed", "recommendation", "complete", "merged"]}}
        orderBy: CCBC_NUMBER_ASC
      ) {
        edges {
          node {
            id
            formData {
              jsonData
            }
            projectInformation {
              jsonData
            }
            applicationMilestoneExcelDataByApplicationId(condition: {archivedAt: null}) {
              nodes {
                jsonData
              }
            }
            applicationFormTemplate9DataByApplicationId {
              nodes {
                jsonData
                source
              }
            }
            applicationAnnouncementsByApplicationId(condition: {archivedAt: null}) {
              nodes {
                announcementByAnnouncementId {
                  jsonData
                }
                isPrimary
              }
              totalCount
            }
            applicationPendingChangeRequestsByApplicationId(condition: {archivedAt: null}) {
              nodes {
                isPending
              }
              totalCount
            }
            conditionalApproval {
              jsonData
            }
            applicationProjectTypesByApplicationId(condition: {archivedAt: null}) {
              nodes {
                projectType
              }
            }
            applicationSowDataByApplicationId(condition: {archivedAt: null}, last: 1) {
              nodes {
                sowTab1SBySowId {
                  totalCount
                  nodes {
                    jsonData
                  }
                }
                sowTab2SBySowId {
                  totalCount
                  nodes {
                    jsonData
                  }
                }
                sowTab7SBySowId {
                  nodes {
                    jsonData
                  }
                  totalCount
                }
                sowTab8SBySowId {
                  totalCount
                  nodes {
                    jsonData
                  }
                }
                jsonData
              }
              totalCount
            }
            applicationAnnouncedsByApplicationId(last: 1, condition: {archivedAt: null}) {
              nodes {
                announced
              }
            }
            assessmentDataByApplicationId(condition: {archivedAt: null}) {
              nodes {
                assessmentDataType
                jsonData
              }
            }
            applicationDependenciesByApplicationId(first: 1) {
              nodes {
                jsonData
              }
            }
            applicationFnhaContributionsByApplicationId {
              edges {
                node {
                  id
                  fnhaContribution
                }
              }
            }
            applicationInternalNotesByApplicationId {
              edges {
                node {
                  note
                }
              }
            }
            ccbcNumber
            externalStatus
            internalDescription
            package
            projectName
            status
            analystStatus
            intakeNumber
            organizationName
            program
            rowId
          }
        }
      }
      allApplicationErs {
        nodes {
          applicationId
          ccbcNumber
          er
        }
      }
    }
`;

const createReportingGcpeMutation = `
  mutation createReportingGcpe($input: CreateReportingGcpeInput!) {
    createReportingGcpe(input: $input) {
      clientMutationId
      reportingGcpe {
        rowId
      }
    }
  }
`;

const getReportingGcpeQuery = `
  query getReportingGcpe($rowId: Int!) {
    reportingGcpeByRowId(rowId: $rowId) {
      reportData
      rowId
    }
  }
`;

const REPORT_TIMEZONE = 'America/Los_Angeles';
const GENERATED_ON_PREFIX = 'Generated on ';
const COMPARING_WITH_PREFIX = 'Comparing with ';

const methodsColumnOptions = [{ width: 80 }];

const formatReportTimestamp = (): string =>
  DateTime.now()
    .setZone(REPORT_TIMEZONE)
    .toLocaleString(DateTime.DATETIME_FULL);

const extractGeneratedOnFromMethodsSheet = (methodsSheet) => {
  const value = methodsSheet?.[0]?.[0]?.value;
  if (typeof value !== 'string') {
    return null;
  }
  if (value.startsWith(GENERATED_ON_PREFIX)) {
    return value.slice(GENERATED_ON_PREFIX.length).trim();
  }
  return null;
};

const extractGeneratedOnFromLegacyInfoRow = (mainSheet) => {
  const value = mainSheet?.[0]?.[0]?.value;
  if (typeof value !== 'string') {
    return null;
  }
  const match = value.match(/GENERATED:\s*(.*)$/);
  return match?.[1]?.trim() || null;
};

const splitReportData = (reportData) => {
  if (Array.isArray(reportData?.[0]?.[0])) {
    return { mainSheet: reportData[0], methodsSheet: reportData[1] };
  }
  return { mainSheet: reportData, methodsSheet: null };
};

const stripLegacyHeaderRow = (mainSheet) => {
  const value = mainSheet?.[0]?.[0]?.value;
  if (
    typeof value === 'string' &&
    value.includes('INTERNAL USE ONLY') &&
    value.includes('GENERATED:')
  ) {
    return mainSheet.slice(1);
  }
  return mainSheet;
};

const normalizeReportData = (reportData) => {
  const { mainSheet, methodsSheet } = splitReportData(reportData || []);
  const normalizedMainSheet = stripLegacyHeaderRow(mainSheet || []);
  const generatedOn =
    extractGeneratedOnFromMethodsSheet(methodsSheet) ||
    extractGeneratedOnFromLegacyInfoRow(mainSheet);
  return { mainSheet: normalizedMainSheet, methodsSheet, generatedOn };
};

const buildMethodsSheet = ({
  generatedOn,
  comparingWith,
}: {
  generatedOn: string;
  comparingWith?: string | null;
}): Row[] => {
  const rows: Row[] = [
    [
      {
        value: `${GENERATED_ON_PREFIX}${generatedOn}`,
        type: String,
        wrap: true,
      },
    ],
  ];
  if (comparingWith) {
    rows.push([
      {
        value: `${COMPARING_WITH_PREFIX}${comparingWith}`,
        type: String,
        wrap: true,
      },
    ]);
  }
  return rows;
};

/**
 * To determine whether old saved reports have a change log column
 */
const hasChangeLogColumn = (excelData: Row[]) => {
  const headerRow = excelData?.[0];
  return (
    headerRow?.some((cell) => cell?.value === CHANGE_LOG_HEADER_CELL.value) ??
    false
  );
};

export const regenerateGcpeReport = async (rowId, req) => {
  const queryResult = await performQuery(
    getReportingGcpeQuery,
    { rowId: parseInt(rowId, 10) },
    req
  );
  const { reportData } = queryResult.data.reportingGcpeByRowId;
  const { mainSheet, methodsSheet, generatedOn } =
    normalizeReportData(reportData);
  const reportGeneratedOn = generatedOn || formatReportTimestamp();
  const normalizedMethodsSheet =
    methodsSheet?.length > 0
      ? methodsSheet
      : buildMethodsSheet({ generatedOn: reportGeneratedOn });
  // due to the way GraphQL mutation handles de/serialization, we need to reformat the data
  mainSheet.forEach((row) => {
    row.forEach((cell) => {
      if (cell?.format === '$#,##0.00' || cell?.format === '0%') {
        // eslint-disable-next-line no-param-reassign
        cell.type = Number;
      }
    });
  });
  const includeChangeLog = hasChangeLogColumn(mainSheet);
  const mainSheetColumns = includeChangeLog
    ? columnOptionsWithChangeLog
    : columnOptions;
  const blob = await writeXlsxFile([mainSheet, normalizedMethodsSheet] as any, {
    fontFamily: 'BC Sans',
    fontSize: 12,
    dateFormat: 'yyyy-mm-dd',
    stickyColumnsCount: 7,
    stickyRowsCount: 1,
    sheets: ['GCPE Report', 'Methods'],
    columns: [mainSheetColumns, methodsColumnOptions],
  });
  return blob;
};

const generateExcelData = async (
  cbcData,
  ccbcData,
  compare = false,
  prevExcelData?
) => {
  const headerRow = compare ? HEADER_ROW_WITH_CHANGE_LOG : HEADER_ROW;
  const excelData = [headerRow];

  cbcData?.data?.allCbcData?.edges?.forEach(async (edges) => {
    const { node } = edges;
    const row: Row = [
      // program
      { value: 'CBC' },
      // announced by province
      { value: convertBoolean(node?.jsonData?.announcedByProvince) },
      // change request pending
      {
        value: node?.cbcByRowId?.cbcApplicationPendingChangeRequestsByCbcId
          ?.edges?.[0]?.node?.isPending
          ? 'YES'
          : 'NO',
      },
      // project complete
      {
        value:
          node?.jsonData?.projectStatus === 'Reporting Complete' ? 'YES' : 'NO',
      },
      // phase
      { value: node?.jsonData?.phase },
      // project #
      { value: node?.projectNumber },
      // ubf/federal project #
      { value: node?.jsonData?.federalProjectNumber },
      // applicant
      { value: node?.jsonData?.currentOperatingName },
      // project title
      { value: node?.jsonData?.projectTitle },
      // economic region
      {
        value: handleCbcEconomicRegions(
          node?.cbcByCbcId?.cbcProjectCommunitiesByCbcId?.nodes
        ),
      },
      // BC/ISED funded
      {
        value: getFundingSource({
          ...node?.jsonData,
          program: 'CBC',
          analystStatus: node?.jsonData?.projectStatus,
          externalStatus: node?.jsonData?.projectStatus,
          applicationSowDataByApplicationId: null,
        }),
      },
      // $830M funding
      {
        value: convertBoolean(node?.jsonData?.eightThirtyMillionFunding),
      },
      // federal funding source
      { value: node?.jsonData?.federalFundingSource },
      // status
      { value: node?.jsonData?.projectStatus },
      // project milestone complete percent
      {
        value: node?.jsonData?.projectMilestoneCompleted
          ? node.jsonData.projectMilestoneCompleted / 100
          : null,
        format: '0%',
        type: Number,
      },
      // project milestone completion date
      { value: cleanDateTime(node?.jsonData?.constructionCompletedOn) },
      // project description
      { value: node?.jsonData?.projectDescription },
      // ndit conditional approval letter send to applicant
      {
        value: convertBoolean(node?.jsonData?.conditionalApprovalLetterSent),
      },
      // binding agreement signed
      {
        value: convertBoolean(node?.jsonData?.agreementSigned),
      },
      // project type
      { value: node?.jsonData?.projectType },
      // bc funding request
      {
        value: node?.jsonData?.bcFundingRequested,
        format: '$#,##0.00',
        type: Number,
      },
      // federal funding
      {
        value: node?.jsonData?.federalFundingRequested,
        format: '$#,##0.00',
        type: Number,
      },
      // FNHA funding
      { value: null },
      // applicant amount
      {
        value: node?.jsonData?.applicantAmount,
        format: '$#,##0.00',
        type: Number,
      },
      // other funding
      {
        value: node?.jsonData?.otherFundingRequested,
        format: '$#,##0.00',
        type: Number,
      },
      // total project budget
      {
        value: node?.jsonData?.totalProjectBudget,
        format: '$#,##0.00',
        type: Number,
      },
      // communities and locales count
      { value: node?.jsonData?.communitiesAndLocalesCount },
      // indigenous communities
      { value: node?.jsonData?.indigenousCommunities },
      // project locations
      { value: node?.jsonData?.projectLocations },
      // household count
      { value: node?.jsonData?.householdCount },
      // transport km
      { value: node?.jsonData?.transportKm },
      // highway km
      { value: node?.jsonData?.highwayKm },
      // rest areas
      { value: node?.jsonData?.restAreas },
      // connected coast network dependent
      {
        value: toTitleCase(
          convertBoolean(node?.jsonData?.connectedCoastNetworkDependant) ?? ''
        ),
      },
      // proposed start date
      { value: cleanDateTime(node?.jsonData?.proposedStartDate) },
      // date approved
      { value: cleanDateTime(node?.jsonData?.dateConditionallyApproved) },
      // proposed completion date
      { value: cleanDateTime(node?.jsonData?.proposedCompletionDate) },
      // date announced
      { value: cleanDateTime(node?.jsonData?.dateAnnounced) },
      // primary news release
      { value: node?.jsonData?.primaryNewsRelease },
      // secondary news release
      { value: node?.jsonData?.secondaryNewsRelease },
      // notes
      { value: node?.jsonData?.notes },
    ];
    // when a comparison report --> add changeLog placeholder
    if (compare) {
      row.push({ value: '' });
    }
    excelData.push(row);
  });

  ccbcData?.data?.allApplications?.edges?.forEach(async (edges) => {
    const { node } = edges;

    const applicationByRowId = node;
    const allApplicationSowData = {
      nodes: node.applicationSowDataByApplicationId?.nodes || [],
    };
    const allIntakes = ccbcData?.data?.allIntakes || { nodes: [] };
    const allApplicationErs = {
      edges:
        ccbcData?.data?.allApplicationErs?.nodes
          ?.filter((er) => er.applicationId === node.rowId)
          ?.map((er) => ({ node: er })) || [],
    };
    const allApplicationRds = { edges: [] }; // Not available in current query

    const summaryData = generateFormData(
      applicationByRowId,
      allApplicationSowData,
      allIntakes,
      allApplicationErs,
      allApplicationRds
    );

    const fundingData = getFundingData(
      node,
      node?.applicationSowDataByApplicationId
    );
    const milestoneProgress =
      node?.applicationMilestoneExcelDataByApplicationId?.nodes[0]?.jsonData
        ?.overallMilestoneProgress ?? null;

    const row: Row = [
      // program
      { value: node?.program },
      // announced by province
      {
        value: node?.applicationAnnouncedsByApplicationId?.nodes[0]?.announced
          ? 'YES'
          : 'NO',
      },
      // change request pending
      {
        value:
          node?.applicationPendingChangeRequestsByApplicationId.totalCount > 0
            ? 'YES'
            : 'NO',
      },
      // project complete
      { value: node?.status === 'complete' ? 'YES' : 'NO' },
      // phase
      { value: null },
      // project #
      { value: node?.ccbcNumber },
      // ubf/federal project #
      { value: null },
      // applicant
      {
        value: node?.formData?.jsonData?.organizationProfile?.organizationName,
      },
      // project title
      { value: node?.projectName },
      // economic region
      {
        value: `${summaryData?.formData?.locations?.economicRegions?.join(', ') || ''}`,
      },
      // BC/ISED funded
      {
        value: getFundingSource(node),
      },
      // $830M funding
      {
        value: node?.ccbcNumber?.includes('CCBC') ? 'YES' : 'NO',
      },
      // federal funding source
      { value: getCCBCFederalFundingSource(node) },
      // status
      { value: convertStatus(node?.analystStatus) },
      // project milestone complete percent
      {
        value: milestoneProgress
          ? Math.trunc(milestoneProgress * 100) / 100
          : null,
        format: '0%',
        type: Number,
      },
      // project milestone completion date
      {
        value:
          node?.applicationMilestoneExcelDataByApplicationId?.nodes[0]?.jsonData
            ?.projectMilestoneCompletionDate,
      },
      // project description
      { value: node?.internalDescription },
      // ndit conditional approval letter send to applicant
      {
        value: node?.conditionalApproval?.jsonData?.letterOfApproval
          ?.letterOfApprovalDateSent
          ? 'YES'
          : 'NO',
      },
      // binding agreement signed
      { value: null },
      // project type
      {
        value: handleProjectType(
          node?.applicationProjectTypesByApplicationId?.nodes[0]?.projectType
        ),
      },
      // bc funding request
      {
        value: summaryData?.formData?.funding?.bcFundingRequested,
        format: '$#,##0.00',
        type: Number,
      },
      // federal funding
      {
        value: summaryData?.formData?.funding?.federalFunding,
        format: '$#,##0.00',
        type: Number,
      },
      // FNHA funding
      {
        value: getFnhaValue(fundingData),
        format: '$#,##0.00',
        type: Number,
      },
      // applicant amount
      {
        value: summaryData?.formData?.funding?.applicantAmount,
        format: '$#,##0.00',
        type: Number,
      },
      // other funding
      {
        value: summaryData?.formData?.funding?.otherFunding,
        format: '$#,##0.00',
        type: Number,
      },
      // total project budget
      {
        value: summaryData?.formData?.funding?.totalProjectBudget,
        format: '$#,##0.00',
        type: Number,
      },
      // communities and locales count
      { value: summaryData?.formData?.counts?.communities || '' },
      // indigenous communities
      { value: summaryData?.formData?.counts?.indigenousCommunities || '' },
      // project locations
      {
        value:
          node?.formData?.jsonData?.projectInformation
            ?.geographicAreaDescription,
      },
      // household count
      {
        value: summaryData?.formData?.counts?.totalHouseholdsImpacted || '',
      },
      // transport km
      { value: null },
      // highway km
      { value: null },
      // rest areas
      { value: null },
      // connected coast network dependent
      {
        value:
          node?.applicationDependenciesByApplicationId?.nodes[0]?.jsonData
            ?.connectedCoastNetworkDependent,
      },
      // proposed start date
      {
        value: `${
          cleanDateTime(
            summaryData?.formData?.eventsAndDates?.proposedStartDate
          ) || ''
        }`,
      },
      // date conditionally approved
      {
        value: getConditionalApprovalDate(node?.conditionalApproval?.jsonData),
      },
      // proposed completion date
      {
        value: cleanDateTime(
          summaryData.formData.eventsAndDates.proposedCompletionDate
        ),
      },
      // date announced
      {
        value: findPrimaryAnnouncementDate(
          node?.applicationAnnouncementsByApplicationId
        ),
      },
      // primary news release
      {
        value: findPrimaryAnnouncement(
          node?.applicationAnnouncementsByApplicationId
        ),
      },
      // secondary news release
      {
        value: findSecondaryAnnouncement(
          node?.applicationAnnouncementsByApplicationId
        ),
      },
      // notes
      {
        value:
          node?.applicationInternalNotesByApplicationId?.edges
            ?.map((edge) => edge?.node?.note)
            .join('\n') || '',
      },
    ];
    // when a comparison report --> add changeLog placeholder
    if (compare) {
      row.push({ value: '' });
    }
    excelData.push(row);
  });
  if (compare) {
    const markedExcelData = compareAndMarkArrays(excelData, prevExcelData);
    return { marked: markedExcelData, unmarked: excelData };
  }
  return excelData;
};

export const generateGcpeReport = async (req) => {
  const cbcData = await performQuery(getCbcDataQuery, {}, req).catch((e) => {
    return e;
  });

  const ccbcData = await performQuery(getCcbcQuery, {}, req).catch((e) => {
    return e;
  });

  const excelData = await generateExcelData(cbcData, ccbcData);
  const generatedOn = formatReportTimestamp();
  const methodsSheet = buildMethodsSheet({ generatedOn });
  const blob = await writeXlsxFile([excelData, methodsSheet] as any, {
    fontFamily: 'BC Sans',
    fontSize: 12,
    dateFormat: 'yyyy-mm-dd',
    stickyColumnsCount: 7,
    stickyRowsCount: 1,
    sheets: ['GCPE Report', 'Methods'],
    columns: [columnOptions, methodsColumnOptions],
  });
  let mutationResult;
  if (blob) {
    mutationResult = await performQuery(
      createReportingGcpeMutation,
      {
        input: {
          reportingGcpe: {
            reportData: [excelData, methodsSheet],
          },
        },
      },
      req
    );
  }
  return {
    blob,
    rowId: mutationResult?.data?.createReportingGcpe?.reportingGcpe?.rowId,
  };
};

export const compareAndGenerateGcpeReport = async (compareRowId, req) => {
  const cbcData = await performQuery(getCbcDataQuery, {}, req).catch((e) => {
    return e;
  });

  const ccbcData = await performQuery(getCcbcQuery, {}, req).catch((e) => {
    return e;
  });

  const queryResult = await performQuery(
    getReportingGcpeQuery,
    { rowId: parseInt(compareRowId, 10) },
    req
  );
  const previousReportData = queryResult.data.reportingGcpeByRowId.reportData;
  const { mainSheet: previousMainSheet, generatedOn: previousGeneratedOn } =
    normalizeReportData(previousReportData);
  // due to the way GraphQL mutation handles de/serialization, we need to reformat the data
  previousMainSheet.forEach((row) => {
    row.forEach((cell) => {
      if (cell?.format === '$#,##0.00' || cell?.format === '0%') {
        // eslint-disable-next-line no-param-reassign
        cell.type = Number;
      }
    });
  });

  const data: any = await generateExcelData(
    cbcData,
    ccbcData,
    true,
    previousMainSheet
  );
  const excelData = data.marked;
  const unmarkedExcelData = data.unmarked;
  const generatedOn = formatReportTimestamp();
  const comparingWith = previousGeneratedOn || formatReportTimestamp();
  const methodsSheet = buildMethodsSheet({ generatedOn, comparingWith });
  const blob = await writeXlsxFile([excelData, methodsSheet] as any, {
    fontFamily: 'BC Sans',
    fontSize: 12,
    dateFormat: 'yyyy-mm-dd',
    stickyColumnsCount: 7,
    stickyRowsCount: 1,
    sheets: ['GCPE Report', 'Methods'],
    columns: [columnOptionsWithChangeLog, methodsColumnOptions],
  });
  let mutationResult;
  if (blob) {
    mutationResult = await performQuery(
      createReportingGcpeMutation,
      {
        input: {
          reportingGcpe: {
            reportData: [unmarkedExcelData, methodsSheet],
          },
        },
      },
      req
    );
  }
  return {
    blob,
    rowId: mutationResult?.data?.createReportingGcpe?.reportingGcpe?.rowId,
  };
};

export const compareGcpeReports = async (sourceRowId, targetRowId, req) => {
  const sourceQueryResult = await performQuery(
    getReportingGcpeQuery,
    { rowId: parseInt(sourceRowId, 10) },
    req
  );
  const targetQueryResult = await performQuery(
    getReportingGcpeQuery,
    { rowId: parseInt(targetRowId, 10) },
    req
  );
  const sourceExcelData =
    sourceQueryResult.data.reportingGcpeByRowId.reportData;
  const targetExcelData =
    targetQueryResult.data.reportingGcpeByRowId.reportData;
  const { mainSheet: sourceMainSheet } =
    normalizeReportData(sourceExcelData);
  const { mainSheet: targetMainSheet, generatedOn: targetGeneratedOn } =
    normalizeReportData(targetExcelData);
  const markedExcelData = compareAndMarkArrays(
    sourceMainSheet,
    targetMainSheet
  );
  // due to the way GraphQL mutation handles de/serialization, we need to reformat the data
  markedExcelData.forEach((row) => {
    row.forEach((cell) => {
      if (cell?.format === '$#,##0.00' || cell?.format === '0%') {
        // eslint-disable-next-line no-param-reassign
        cell.type = Number;
      }
    });
  });
  const generatedOn = formatReportTimestamp();
  const comparingWith = targetGeneratedOn || formatReportTimestamp();
  const methodsSheet = buildMethodsSheet({ generatedOn, comparingWith });
  const blob = await writeXlsxFile([markedExcelData, methodsSheet] as any, {
    fontFamily: 'BC Sans',
    fontSize: 12,
    dateFormat: 'yyyy-mm-dd',
    stickyColumnsCount: 7,
    stickyRowsCount: 1,
    sheets: ['GCPE Report', 'Methods'],
    columns: [columnOptionsWithChangeLog, methodsColumnOptions],
  });
  return blob;
};
