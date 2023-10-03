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
      projectNumber: project['A'],
      orignalProjectNumber: project['B'],
      phase: project['C'],
      intake: project['D'],
      projectStatus: project['E'],
      projectTitle: project['F'],
      projectDescription: project['G'],
      applicant: project['H'],
      eightThirtyMillionFunding: project['I'],
      federalFundingSource: project['J'],
      federalProjectNumber: project['K'],
      projectType: project['L'],
      transportProjectType: project['M'],
      highwayProjectType: project['N'],
      lastMileProjectType: project['O'],
      lastMileMinimumSpeed: project['P'],
      connectedCoastNetworkDependant: project['Q'],
      projectLocations: project['R'],
      communitiesAndLocalesCount: project['S'],
      indigenousCommunities: project['T'],
      householdCount: project['U'],
      transportKm: project['V'],
      highwayKm: project['W'],
      restAreas: project['X'],
      bcFundingRequest: project['Y'],
      federalFundingRequest: project['Z'],
      applicantAmount: project['AA'],
      otherFunding: project['AB'],
      totalProjectBudget: project['AC'],
      nditConditionalApprovalLetterSent: project['AD'],
      bindingAgreementSignedNditRecipient: project['AE'],
      announcedByProvince: project['AF'],
      dateApplicationReceived:
        project['AG'] && convertExcelDateToJSDate(project['AG']),
      dateConditionallyApproved:
        project['AH'] && convertExcelDateToJSDate(project['AH']),
      dateAgreementSigned:
        project['AI'] && convertExcelDateToJSDate(project['AI']),
      proposedStartDate:
        project['AJ'] && convertExcelDateToJSDate(project['AJ']),
      proposedCompletionDate:
        project['AK'] && convertExcelDateToJSDate(project['AK']),
      reportingCompletionDate:
        project['AL'] && convertExcelDateToJSDate(project['AL']),
      dateAnnounced: project['AM'] && convertExcelDateToJSDate(project['AM']),
      projectMilestoneCompleted: project['AN'],
      constructionCompletedOnTime: project['AO'],
      milestoneComments: project['AP'],
      primaryNewsRelease: project['AQ'],
      secondaryNewsRelease: project['AR'],
      notes: project['AS'],
      locked: project['AT'],
      lastReviewed: project['AU'],
      reviewNotes: project['AV'],
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
