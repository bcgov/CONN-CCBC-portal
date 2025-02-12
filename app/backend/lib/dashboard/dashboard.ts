import writeXlsxFile, { Row } from 'write-excel-file';
import generateFormData from '../../../lib/helpers/ccbcSummaryGenerateFormData';
import { performQuery } from '../graphql';
import {
  cleanDateTime,
  convertBoolean,
  handleProjectType,
} from '../reporting/util';
import { generateHeaderInfoRow, HEADER_ROW } from './header';
import {
  convertStatus,
  formatCurrency,
  handleCbcCommunities,
  handleCcbcCommunities,
  handleLastMileSpeed,
} from './util';
import columnOptions from './column_options';

const getApplicationDataQuery = `
  query applicationDataQuery($rowId: Int!) {
    applicationByRowId(rowId: $rowId) {
      announcements {
        totalCount
      }
      applicationAnnouncedsByApplicationId(
        last: 1
        condition: { archivedAt: null }
      ) {
        nodes {
          announced
        }
      }
      applicationDependenciesByApplicationId(first: 1) {
        nodes {
          jsonData
        }
      }
      applicationStatusesByApplicationId(
        filter: { status: { equalTo: "submitted" } }
      ) {
        nodes {
          createdAt
          status
        }
      }
      allAssessments {
        nodes {
          assessmentDataType
          jsonData
        }
      }
      formData {
        jsonData
      }
      projectInformationDataByApplicationId(last: 1) {
        nodes {
          jsonData
        }
      }
      applicationMilestoneExcelDataByApplicationId(
        condition: { archivedAt: null }
      ) {
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
      conditionalApproval {
        jsonData
      }
      changeRequestDataByApplicationId {
        edges {
          node {
            id
          }
        }
      }
      applicationPendingChangeRequestsByApplicationId(
        condition: {archivedAt: null}
        last: 1
      ) {
        nodes {
          isPending
        }
        totalCount
      }
      applicationProjectTypesByApplicationId(condition: {archivedAt: null}) {
        nodes {
          projectType
        }
      }
      status
      intakeNumber
      ccbcNumber
      zone
      projectName
      program
      package
      organizationName
      externalStatus
      announced
      internalDescription
    }
    # Cannot run it inside the above due to conflict of filter with header
    allApplicationSowData(
      filter: { applicationId: { equalTo: $rowId } }
      condition: { archivedAt: null }
      last: 1
    ) {
      nodes {
        rowId
        jsonData
        sowTab1SBySowId {
          nodes {
            jsonData
            rowId
            sowId
          }
        }
        sowTab2SBySowId {
          nodes {
            rowId
            sowId
            jsonData
          }
        }
        sowTab7SBySowId {
          nodes {
            jsonData
            rowId
            sowId
          }
        }
        sowTab8SBySowId {
          nodes {
            rowId
            jsonData
            sowId
          }
        }
      }
    }
    allIntakes {
      nodes {
        closeTimestamp
        ccbcIntakeNumber
      }
    }
    allApplicationErs(filter: { applicationId: { equalTo: $rowId } }) {
      edges {
        node {
          applicationId
          ccbcNumber
          er
        }
      }
    }
    allApplicationRds(filter: { applicationId: { equalTo: $rowId } }) {
      edges {
        node {
          applicationId
          ccbcNumber
          rd
        }
      }
    }
  }
`;

const getCbcDataQuery = `
  query cbcDataQuery($rowId: Int!) {
    cbcByRowId(rowId: $rowId) {
      projectNumber
      rowId
      sharepointTimestamp
      cbcDataByCbcId(last: 1) {
        edges {
          node {
            jsonData
            sharepointTimestamp
            rowId
            projectNumber
            updatedAt
            updatedBy
          }
        }
      }
      cbcProjectCommunitiesByCbcId(filter: { archivedAt: { isNull: true } }) {
        nodes {
          communitiesSourceDataByCommunitiesSourceDataId {
            economicRegion
            geographicNameId
            geographicType
            regionalDistrict
            bcGeographicName
            rowId
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
`;

export const generateApplicationData = async (ids: number[], req) => {
  if (!ids) {
    return [];
  }
  const data = await Promise.all(
    ids?.map(async (id) => {
      const applicationData = await performQuery(
        getApplicationDataQuery,
        { rowId: id },
        req
      );
      return applicationData;
    })
  );
  return data;
};

export const generateCbcData = async (ids: number[], req) => {
  if (!ids) {
    return [];
  }
  const data = await Promise.all(
    ids?.map(async (id) => {
      const cbcData = await performQuery(getCbcDataQuery, { rowId: id }, req);
      return cbcData;
    })
  );
  return data;
};

export const generateDashboardExport = async (applicationData, cbcData) => {
  const infoRow = generateHeaderInfoRow();
  const excelData = [infoRow, HEADER_ROW];

  // do application (ccbc and other)
  applicationData?.forEach((app) => {
    const { data } = app;
    const summaryData = generateFormData(
      data.applicationByRowId,
      data.allApplicationSowData,
      data.allIntakes,
      data.allApplicationErs,
      data.allApplicationRds
    );
    const benefitingCommunities =
      handleCcbcCommunities(
        summaryData?.formData?.locations?.benefitingCommunities
      ) || null;
    const benefitingCommunitiesNames =
      benefitingCommunities?.map((c) => c?.name) || [];
    const benefitingCommunitiesIds =
      benefitingCommunities?.map((c) => c?.id) || [];
    const benefitingIndigenousCommunities =
      handleCcbcCommunities(
        summaryData?.formData?.locations?.benefitingIndigenousCommunities
      ) || null;
    const benefitingIndigenousCommunitiesNames =
      benefitingIndigenousCommunities?.map((c) => c?.name) || [];
    const benefitingIndigenousCommunitiesIds =
      benefitingIndigenousCommunities?.map((c) => c?.id) || [];
    const row: Row = [
      // program
      { value: data?.applicationByRowId?.program },
      // project id
      { value: data?.applicationByRowId?.ccbcNumber },
      // phase
      { value: null },
      // zone
      { value: data?.applicationByRowId?.zone },
      // intake number
      { value: data?.applicationByRowId?.intakeNumber },
      // internal status
      { value: convertStatus(data?.applicationByRowId?.status) },
      // external status
      { value: convertStatus(data?.applicationByRowId?.externalStatus) },
      // change request pending
      {
        value: convertBoolean(
          data?.applicationByRowId
            ?.applicationPendingChangeRequestsByApplicationId?.nodes?.[0]
            ?.isPending
        )
          ? 'YES'
          : 'NO',
      },
      // project title
      { value: data?.applicationByRowId?.projectName },
      // project description
      { value: data?.applicationByRowId?.internalDescription },
      // current operating name
      { value: data?.applicationByRowId?.organizationName },
      // 830 million funding
      {
        value: data?.applicationByRowId?.ccbcNumber.includes('CCBC')
          ? 'YES'
          : 'NO',
      },
      // federal funding source
      { value: 'ISED-UBF Core' },
      // federal project number
      { value: null },
      // project type
      {
        value: handleProjectType(
          data?.applicationByRowId?.applicationProjectTypesByApplicationId
            ?.nodes?.[0]?.projectType
        ),
      },
      // transport project type
      { value: null },
      // highway project type
      { value: null },
      // last mile technology
      { value: null },
      // last mile minimum speed
      { value: handleLastMileSpeed(data?.applicationByRowId?.status) },
      // connected coast network dependent
      {
        value: `${summaryData?.formData?.dependency?.connectedCoastNetworkDependent || ''}`,
      },
      // project location ??
      { value: null },
      { value: `${summaryData?.formData?.locations?.economicRegions || ''}` },
      // regional district
      { value: `${summaryData?.formData?.locations?.regionalDistricts || ''}` },
      // geographic names
      {
        value: `${benefitingCommunitiesNames.join(',')} ${benefitingIndigenousCommunitiesNames.join(',')}`,
      },
      {
        value: `${benefitingCommunitiesIds.join(',')} ${benefitingIndigenousCommunitiesIds.join(',')}`,
      },
      // total communities and locales
      { value: summaryData?.formData?.counts?.communities || '' },
      // indigenous communities
      { value: summaryData?.formData?.counts?.indigenousCommunities || '' },
      // household count
      { value: summaryData?.formData?.counts?.totalHouseholdsImpacted || '' },
      // transport km
      { value: null },
      // highway km
      { value: null },
      // rest areas
      { value: null },
      // bc funding requested
      {
        value: formatCurrency(
          summaryData?.formData?.funding?.bcFundingRequested
        ),
      },
      // applicant amount
      {
        value: formatCurrency(summaryData?.formData?.funding?.applicantAmount),
      },
      // other funds requested
      {
        value: formatCurrency(
          summaryData?.formData?.funding?.otherFundingRequested
        ),
      },
      // total fnha funding
      { value: formatCurrency(summaryData?.formData?.funding?.fhnaFunding) },
      // total project budget
      {
        value: formatCurrency(
          summaryData?.formData?.funding?.totalProjectBudget
        ),
      },
      // announced by bc/ised
      { value: convertBoolean(data?.applicationByRowId?.announced) },
      // date application received
      {
        value: `${
          cleanDateTime(
            summaryData?.formData?.eventsAndDates?.dateApplicationReceived
          ) || ''
        }`,
      },
      // date conditionally approved
      {
        value: `${
          cleanDateTime(
            summaryData?.formData?.eventsAndDates?.dateConditionallyApproved
          ) || ''
        }`,
      },
      // date agreement signed
      {
        value: `${
          cleanDateTime(
            summaryData?.formData?.eventsAndDates?.dateAgreementSigned
          ) || ''
        }`,
      },
      // proposed start date
      {
        value: `${
          cleanDateTime(
            summaryData?.formData?.eventsAndDates?.proposedStartDate
          ) || ''
        }`,
      },
      // % project milestone completion
      {
        value: `${summaryData?.formData?.milestone?.percentProjectMilestoneComplete || ''}`,
      },
      // construction completed on
      { value: null },
    ];
    excelData.push(row);
  });

  // then do cbc
  cbcData?.forEach((cbc) => {
    const { data } = cbc;
    const cbcDataByCbcId =
      data?.cbcByRowId?.cbcDataByCbcId?.edges?.[0].node?.jsonData;
    const cbcProjectCommunitiesByCbcId =
      data?.cbcByRowId?.cbcProjectCommunitiesByCbcId?.nodes;
    const communities = handleCbcCommunities(cbcProjectCommunitiesByCbcId);
    const row: Row = [
      // program
      { value: 'CBC' },
      // project id
      {
        value: data?.cbcByRowId?.projectNumber,
      },
      // phase
      {
        value: cbcDataByCbcId?.phase
          ? parseInt(cbcDataByCbcId?.phase, 10)
          : null,
        type: Number,
      },
      // zone
      { value: null },
      // intake number
      {
        value: cbcDataByCbcId?.intake,
      },
      // internal status
      {
        value: convertStatus(cbcDataByCbcId?.projectStatus),
      },
      // external status
      {
        value: convertStatus(cbcDataByCbcId?.projectStatus),
      },
      // change request pending
      {
        value: data?.cbcByRowId?.cbcApplicationPendingChangeRequestsByCbcId
          ?.edges?.[0]?.node?.isPending
          ? 'YES'
          : 'NO',
      },
      // project title
      {
        value: cbcDataByCbcId?.projectTitle,
      },
      // project description
      {
        value: cbcDataByCbcId?.projectDescription,
      },
      // current operating name
      {
        value: cbcDataByCbcId?.currentOperatingName,
      },
      // 830 million funding
      {
        value: convertBoolean(cbcDataByCbcId?.eightThirtyMillionFunding),
      },
      // federal funding source
      {
        value: cbcDataByCbcId?.federalFundingSource,
      },
      // federal project number
      {
        value: cbcDataByCbcId?.federalProjectNumber,
      },
      // project type ??
      {
        value: cbcDataByCbcId?.projectType,
      },
      // transport project type
      {
        value: cbcDataByCbcId?.transportProjectType,
      },
      // highway project type
      {
        value: cbcDataByCbcId?.highwayProjectType,
      },
      // last mile technology
      {
        value: cbcDataByCbcId?.lastMileProjectType,
      },
      // last mile minimum speed
      {
        value: cbcDataByCbcId?.lastMileMinimumSpeed,
      },
      // connected coast network dependent
      {
        value: convertBoolean(cbcDataByCbcId?.connectedCoastNetworkDependent),
      },
      // project location
      {
        value: cbcDataByCbcId?.projectLocations,
      },
      // economic region
      { value: communities.economicRegions },
      // regional district
      { value: communities.regionalDistricts },
      // geographic names
      { value: communities.bcGeographicNames },
      // geo ids
      { value: communities.bcGeographicIds },
      // total communities and locales
      { value: communities.totalCount },
      // indigenous communities
      { value: null },
      // household count
      {
        value: cbcDataByCbcId?.householdCount,
      },
      // transport km
      {
        value: cbcDataByCbcId?.transportKm,
      },
      // highway km
      {
        value: cbcDataByCbcId?.highwayKm,
      },
      // rest areas
      {
        value: cbcDataByCbcId?.restAreas,
      },
      // bc funding requested
      {
        value: cbcDataByCbcId?.bcFundingRequested,
        format: '$#,##0.00',
        type: Number,
      },
      // applicant amount
      {
        value: cbcDataByCbcId?.applicantAmount,
        format: '$#,##0.00',
        type: Number,
      },
      // other funds requested
      {
        value: cbcDataByCbcId?.otherFundingRequested,
        format: '$#,##0.00',
        type: Number,
      },
      // total fnha funding
      { value: null },
      // total project budget
      {
        value: cbcDataByCbcId?.totalProjectBudget,
        format: '$#,##0.00',
        type: Number,
      },
      // announced by bc/ised
      { value: convertBoolean(cbcDataByCbcId?.announcedByProvince) },
      // date application received
      { value: cleanDateTime(cbcDataByCbcId?.dateApplicationReceived) },
      // date conditionally approved
      { value: cleanDateTime(cbcDataByCbcId?.dateConditionallyApproved) },
      // date agreement signed
      { value: cleanDateTime(cbcDataByCbcId?.dateAgreementSigned) },
      // proposed start date
      { value: cleanDateTime(cbcDataByCbcId?.proposedStartDate) },
      // % project milestone completion
      {
        value: cbcDataByCbcId?.projectMilestoneCompleted
          ? cbcDataByCbcId.projectMilestoneCompleted / 100
          : null,
        format: '0%',
        type: Number,
      },
      // construction completed on
      { value: cleanDateTime(cbcDataByCbcId?.constructionCompletedOn) },
    ];
    excelData.push(row);
  });

  const blob = await writeXlsxFile(excelData as any, {
    fontFamily: 'BC Sans',
    fontSize: 12,
    dateFormat: 'yyyy-mm-dd',
    stickyColumnsCount: 2,
    sheet: 'Export',
    columns: columnOptions,
  });
  return blob;
};
