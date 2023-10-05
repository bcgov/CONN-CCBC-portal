import * as XLSX from 'xlsx';
import { performQuery } from '../graphql';
import { convertExcelDateToJSDate } from '../sow_import/util';

const createCbcProjectMutation = `
  mutation cbcProjectMutation($input: CreateCbcProjectInput!) {
    createCbcProject(input: $input) {
        cbcProject {
        id
        rowId
        jsonData
      }
      clientMutationId
    }
  }
`;

const readSummary = async (wb, sheet) => {
  const cbcProjectsSheet = XLSX.utils.sheet_to_json(wb.Sheets[sheet], {
    header: 'A',
  });
  const cbcProjectList = [];
  const columnList = cbcProjectsSheet[0];

  // reverse key value pairs so we can get the column location
  const columns = Object.fromEntries(
    Object.entries(columnList).map((a) => a.reverse())
  );

  cbcProjectsSheet.forEach((proj) => {
    // filter values from proj which are 'NULL'
    const project = Object.fromEntries(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      Object.entries(proj).filter(([_, v]) => v !== 'NULL')
    );

    // filter out rows with no project number or project number is not a number
    if (
      Object.keys(project).length <= 2 ||
      typeof project['A'] !== 'number' ||
      !project['A']
    ) {
      return;
    }

    const cbcProject = {
      projectNumber: project[columns['Project #']],
      orignalProjectNumber: project[columns['Original Project #']],
      phase: project[columns['Phase']],
      intake: project[columns['Intake']],
      projectStatus: project[columns['Project Status']],
      projectTitle: project[columns['Project Title']],
      projectDescription: project[columns['Project Description']],
      applicant: project[columns['Applicant']],
      eightThirtyMillionFunding: project[columns['$830 million funding']],
      federalFundingSource: project[columns['Federal Funding Source']],
      federalProjectNumber: project[columns['Federal Project #']],
      projectType: project[columns['Project Type']],
      transportProjectType: project[columns['Transport Project Type']],
      highwayProjectType: project[columns['Highway Project Type']],
      lastMileProjectType: project[columns['Last Mile Project Type']],
      lastMileMinimumSpeed: project[columns['Last Mile Minimum Speed']],
      connectedCoastNetworkDependant:
        project[columns['Connected Coast Network Dependant']],
      projectLocations: project[columns['Project Locations']],
      communitiesAndLocalesCount:
        project[columns['Communities and Locales Count']],
      indigenousCommunities: project[columns['Indigenous Communities']],
      householdCount: project[columns['Household Count']],
      transportKm: project[columns['Transport km']],
      highwayKm: project[columns['Highway km']],
      restAreas: project[columns['Rest Areas']],
      bcFundingRequest: project[columns['BC Funding Request']],
      federalFundingRequest: project[columns['Federal Funding Request']],
      applicantAmount: project[columns['Applicant Amount']],
      otherFunding: project[columns['Other Funding']],
      totalProjectBudget: project[columns['Total Project Budget']],
      nditConditionalApprovalLetterSent:
        project[columns['NDIT Conditional Approval Letter Send to Applicant']],
      bindingAgreementSignedNditRecipient:
        project[columns['Binding Agreement Signed (NDIT Recipient)']],
      announcedByProvince: project[columns['Announced by Province']],
      dateApplicationReceived:
        project[columns['Date Application Received']] &&
        convertExcelDateToJSDate(project[columns['Date Application Received']]),
      dateConditionallyApproved:
        project[columns['Date Conditionally Approved']] &&
        convertExcelDateToJSDate(
          project[columns['Date Conditionally Approved']]
        ),
      dateAgreementSigned:
        project[columns['Date Agreement Signed']] &&
        convertExcelDateToJSDate(project[columns['Date Agreement Signed']]),
      proposedStartDate:
        project[columns['Proposed Start Date']] &&
        convertExcelDateToJSDate(project[columns['Proposed Start Date']]),
      proposedCompletionDate:
        project[columns['Proposed Completion Date']] &&
        convertExcelDateToJSDate(project[columns['Proposed Completion Date']]),
      reportingCompletionDate:
        project[columns['Reporting Completion Date']] &&
        convertExcelDateToJSDate(project[columns['Reporting Completion Date']]),
      dateAnnounced:
        project[columns['Date Announced']] &&
        convertExcelDateToJSDate(project[columns['Date Announced']]),
      projectMilestoneCompleted:
        project[columns['Project Milestone Completed']] &&
        project[columns['Project Milestone Completed']],
      constructionCompletedOn:
        project[columns['Construction Completed On']] &&
        project[columns['Construction Completed On']],
      milestoneComments:
        project[columns['Milestone Comments']] &&
        project[columns['Milestone Comments']],
      primaryNewsRelease:
        project[columns['Primary News Release']] &&
        project[columns['Primary News Release']],
      secondaryNewsRelease:
        project[columns['Secondary News Release']] &&
        project[columns['Secondary News Release']],
      notes: project[columns['Notes']] && project[columns['Notes']],
      locked: project[columns['Locked']] && project[columns['Locked']],
      lastReviewed:
        project[columns['Last Reviewed']] && project[columns['Last Reviewed']],
      errorLog: [],
    };

    cbcProjectList.push(cbcProject);
  });

  const cbcProjectData = {
    _jsonData: cbcProjectList,
  };

  return cbcProjectData;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ValidateData = async (data) => {
  const errors = [];

  // validation checks here

  return errors;
};

const LoadCbcProjectData = async (wb, sheet, sharepointTimestamp, req) => {
  const data = await readSummary(wb, sheet);

  const errorList = await ValidateData(data._jsonData);
  if (errorList.length > 0) {
    return { error: errorList };
  }

  // time to persist in DB
  const result = await performQuery(
    createCbcProjectMutation,
    {
      input: {
        _jsonData: data._jsonData,
        _sharepointTimestamp: sharepointTimestamp,
      },
    },
    req
  ).catch((e) => {
    return { error: e };
  });
  return result;
};

export default LoadCbcProjectData;
