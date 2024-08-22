import writeXlsxFile, { Row } from 'write-excel-file';
import { DateTime } from 'luxon';
import { performQuery } from '../graphql';
import { HEADER_ROW, generateHeaderInfoRow } from './header';
import columnOptions from './column_options';
import {
  cleanDateTime,
  compareAndMarkArrays,
  convertBoolean,
  convertStatus,
  findPrimaryAnnouncement,
  findPrimaryAnnouncementDate,
  findSecondaryAnnouncement,
  getConnectedCoastDependent,
  getHouseholdCount,
  getTotalProjectBudget,
  handleProjectType,
} from './util';

const getCbcDataQuery = `
    query getCbcData {
        allCbcData {
            edges {
                node {
                    projectNumber
                    jsonData
                }
            }
        }
    }
`;

const getCcbcQuery = `
    query getCcbc {
      allApplications(
        filter: {status: {in: ["conditionally_approved", "approved", "on_hold", "closed", "recommendation", "complete"]}}
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
            ccbcNumber
            externalStatus
            internalDescription
            package
            projectName
            status
            intakeNumber
            organizationName
          }
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

export const regenerateGcpeReport = async (rowId, req) => {
  const queryResult = await performQuery(
    getReportingGcpeQuery,
    { rowId: parseInt(rowId, 10) },
    req
  );
  const excelData = queryResult.data.reportingGcpeByRowId.reportData;
  // due to the way GraphQL mutation handles de/serialization, we need to reformat the data
  excelData.forEach((row) => {
    row.forEach((cell) => {
      if (cell?.format === '$#,##0.00' || cell?.format === '0%') {
        // eslint-disable-next-line no-param-reassign
        cell.type = Number;
      }
    });
  });
  const blob = await writeXlsxFile(excelData as any, {
    fontFamily: 'BC Sans',
    fontSize: 12,
    dateFormat: 'yyyy-mm-dd',
    stickyColumnsCount: 7,
    sheet: 'GCPE Report',
    columns: columnOptions,
  });
  return blob;
};

const generateExcelData = async (
  cbcData,
  ccbcData,
  compare = false,
  prevExcelData?
) => {
  const infoRow = generateHeaderInfoRow();

  const excelData = [infoRow, HEADER_ROW];

  cbcData?.data?.allCbcData?.edges?.forEach(async (edges) => {
    const { node } = edges;
    const row: Row = [
      // program
      { value: 'CBC' },
      // announced by province
      { value: convertBoolean(node?.jsonData?.announcedByProvince) },
      // change request pending
      { value: convertBoolean(node?.jsonData?.changeRequestPending) },
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
      { value: 'TBD' },
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
      // FHNA funding
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
      { value: convertBoolean(node?.jsonData?.connectedCoastNetworkDependant) },
      // proposed start date
      { value: cleanDateTime(node?.jsonData?.proposedStartDate) },
      // date approved
      { value: cleanDateTime(node?.jsonData?.dateConditionallyApproved) },
      // proposed project milestone completion date
      { value: cleanDateTime(node?.jsonData?.proposedCompletionDate) },
      // date announced
      { value: cleanDateTime(node?.jsonData?.dateAnnounced) },
      // primary news release
      { value: node?.jsonData?.primaryNewsRelease },
      // secondary news release
      { value: node?.jsonData?.secondaryNewsRelease },
    ];
    excelData.push(row);
  });

  ccbcData?.data?.allApplications?.edges?.forEach(async (edges) => {
    const { node } = edges;
    const row: Row = [
      // program
      { value: 'CCBC' },
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
      { value: node?.formData?.jsonData?.projectInformation?.projectTitle },
      // economic region
      { value: 'TBD' },
      // federal funding source
      { value: 'ISED-UBF Core' },
      // status
      { value: convertStatus(node?.status) },
      // project milestone complete percent
      {
        value:
          node?.applicationMilestoneExcelDataByApplicationId?.nodes[0]?.jsonData
            ?.projectMilestoneCompleted,
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
        value: node?.formData?.jsonData?.bcFundingRequest,
        format: '$#,##0.00',
        type: Number,
      },
      // federal funding
      {
        value: node?.formData?.jsonData?.projectFunding?.federalFunding,
        format: '$#,##0.00',
        type: Number,
      },
      // FHNA funding
      { value: null },
      // applicant amount
      {
        value:
          node?.formData?.jsonData?.projectFunding?.totalApplicantContribution,
        format: '$#,##0.00',
        type: Number,
      },
      // other funding
      {
        value: node?.formData?.jsonData?.otherFunding,
        format: '$#,##0.00',
        type: Number,
      },
      // total project budget
      {
        value: getTotalProjectBudget(
          node?.applicationSowDataByApplicationId?.nodes[0]?.sowTab7SBySowId
            ?.nodes[0],
          node?.formData?.jsonData?.totalProjectBudget
        ),
        format: '$#,##0.00',
        type: Number,
      },
      // communities and locales count
      { value: node?.formData?.jsonData?.communitiesAndLocalesCount },
      // indigenous communities
      { value: node?.formData?.jsonData?.householdsImpactedIndigenous },
      // project locations
      {
        value:
          node?.formData?.jsonData?.projectInformation
            ?.geographicAreaDescription,
      },
      // household count
      {
        value: getHouseholdCount(
          node?.applicationSowDataByApplicationId?.nodes[0]?.sowTab1SBySowId
            ?.nodes[0],
          node?.formData?.jsonData
        ),
      },
      // transport km
      { value: null },
      // highway km
      { value: null },
      // rest areas
      { value: null },
      // connected coast network dependent
      {
        value: getConnectedCoastDependent(node?.assessmentDataByApplicationId),
      },
      // proposed start date
      { value: node?.formData?.jsonData?.projectPlan?.projectStartDate },
      // date conditionally approved
      { value: node?.conditionalApproval?.jsonData?.decision?.ministerDate },
      // proposed project milestone completion date
      {
        value: null,
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
    ];
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

  const blob = await writeXlsxFile(excelData as any, {
    fontFamily: 'BC Sans',
    fontSize: 12,
    dateFormat: 'yyyy-mm-dd',
    stickyColumnsCount: 7,
    sheet: 'GCPE Report',
    columns: columnOptions,
  });
  let mutationResult;
  if (blob) {
    mutationResult = await performQuery(
      createReportingGcpeMutation,
      {
        input: {
          reportingGcpe: {
            reportData: excelData,
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
  const previousExcelData = queryResult.data.reportingGcpeByRowId.reportData;
  // due to the way GraphQL mutation handles de/serialization, we need to reformat the data
  previousExcelData.forEach((row) => {
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
    previousExcelData
  );
  const excelData = data.marked;
  const unmarkedExcelData = data.unmarked;
  const blob = await writeXlsxFile(excelData as any, {
    fontFamily: 'BC Sans',
    fontSize: 12,
    dateFormat: 'yyyy-mm-dd',
    stickyColumnsCount: 7,
    sheet: 'GCPE Report',
    columns: columnOptions,
  });
  let mutationResult;
  if (blob) {
    mutationResult = await performQuery(
      createReportingGcpeMutation,
      {
        input: {
          reportingGcpe: {
            reportData: unmarkedExcelData,
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
  const markedExcelData = compareAndMarkArrays(
    sourceExcelData,
    targetExcelData
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
  // modify header to show correct time of comparison
  markedExcelData[0][0].value = `INTERNAL USE ONLY: Not to be distributed outside Ministry of Citizen's Services\nGENERATED: ${DateTime.now().setZone('America/Los_Angeles').toLocaleString(DateTime.DATETIME_FULL)}`;
  const blob = await writeXlsxFile(markedExcelData as any, {
    fontFamily: 'BC Sans',
    fontSize: 12,
    dateFormat: 'yyyy-mm-dd',
    stickyColumnsCount: 7,
    sheet: 'GCPE Report',
    columns: columnOptions,
  });
  return blob;
};
