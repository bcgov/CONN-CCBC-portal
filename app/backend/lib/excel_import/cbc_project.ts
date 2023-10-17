import * as XLSX from 'xlsx';
import { performQuery } from '../graphql';
import {
  validateColumns,
  validateDate,
  validateNumber,
} from './validate_cbc_project';

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

const cbcErrorList = [];

const readSummary = async (wb, sheet) => {
  const cbcProjectsSheet = XLSX.utils.sheet_to_json(wb.Sheets[sheet], {
    header: 'A',
  });
  const cbcProjectList = [];

  cbcProjectsSheet.forEach((proj) => {
    const errorLog = [];
    // filter values from proj which are 'NULL'
    const project = Object.fromEntries(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      Object.entries(proj).filter(([_, v]) => v !== 'NULL')
    );

    const projectNumber = project['A'];

    // filter out rows with no project number or project number is not a number
    if (
      Object.keys(project).length <= 2 ||
      typeof projectNumber !== 'number' ||
      !projectNumber
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
      communitiesAndLocalesCount: validateNumber(
        project['S'],
        'communitiesAndLocalesCount',
        errorLog,
        projectNumber
      ),
      indigenousCommunities: validateNumber(
        project['T'],
        'indigenousCommunities',
        errorLog,
        projectNumber
      ),
      householdCount: validateNumber(
        project['U'],
        'householdCount',
        errorLog,
        projectNumber
      ),
      transportKm: validateNumber(
        project['V'],
        'transportKm',
        errorLog,
        projectNumber
      ),
      highwayKm: validateNumber(
        project['W'],
        'highwayKm',
        errorLog,
        projectNumber
      ),
      restAreas: project['X'],
      bcFundingRequest: validateNumber(
        project['Y'],
        'bcFundingRequest',
        errorLog,
        projectNumber
      ),
      federalFunding: validateNumber(
        project['Z'],
        'federalFunding',
        errorLog,
        projectNumber
      ),
      applicantAmount: validateNumber(
        project['AA'],
        'applicantAmount',
        errorLog,
        projectNumber
      ),
      otherFunding: validateNumber(
        project['AB'],
        'otherFunding',
        errorLog,
        projectNumber
      ),
      totalProjectBudget: validateNumber(
        project['AC'],
        'totalProjectBudget',
        errorLog,
        projectNumber
      ),
      nditConditionalApprovalLetterSent: project['AD'],
      bindingAgreementSignedNditRecipient: project['AE'],
      announcedByProvince: project['AF'],
      dateApplicationReceived: validateDate(
        project['AG'],
        'dateApplicationReceived',
        errorLog,
        projectNumber
      ),
      dateConditionallyApproved: validateDate(
        project['AH'],
        'dateConditionallyApproved',
        errorLog,
        projectNumber
      ),
      dateAgreementSigned: validateDate(
        project['AI'],
        'dateAgreementSigned',
        errorLog,
        projectNumber
      ),
      proposedStartDate: validateDate(
        project['AJ'],
        'proposedStartDate',
        errorLog,
        projectNumber
      ),
      proposedCompletionDate: validateDate(
        project['AK'],
        'proposedCompletionDate',
        errorLog,
        projectNumber
      ),
      reportingCompletionDate: validateDate(
        project['AL'],
        'reportingCompletionDate',
        errorLog,
        projectNumber
      ),
      dateAnnounced: validateDate(
        project['AM'],
        'dateAnnounced',
        errorLog,
        projectNumber
      ),
      projectMilestoneCompleted: validateDate(
        project['AN'],
        'projectMilestoneCompleted',
        errorLog,
        projectNumber
      ),

      constructionCompletedOn: validateDate(
        project['AO'],
        'constructionCompletedOn',
        errorLog,
        projectNumber
      ),
      milestoneComments: project['AP'],
      primaryNewsRelease: project['AQ'],
      secondaryNewsRelease: project['AR'],
      notes: project['AS'],
      locked: project['AT'],
      lastReviewed: validateDate(
        project['AU'],
        'lastReviewed',
        errorLog,
        projectNumber
      ),
      reviewNotes: project['AV'],
      errorLog,
    };

    cbcErrorList.push(...errorLog);

    cbcProjectList.push(cbcProject);
  });

  const cbcProjectData = {
    _jsonData: cbcProjectList,
  };

  return cbcProjectData;
};

const ValidateData = async (wb, sheet) => {
  const cbcProjectsSheet = XLSX.utils.sheet_to_json(wb.Sheets[sheet], {
    header: 'A',
  });

  const columnList = cbcProjectsSheet[0];

  const errors = validateColumns(columnList);

  return errors;
};

const LoadCbcProjectData = async (wb, sheet, sharepointTimestamp, req) => {
  const data = await readSummary(wb, sheet);

  const errorList = await ValidateData(wb, sheet);

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
    return { error: [e] };
  });

  return {
    ...result,
    errorLog: cbcErrorList,
  };
};

export default LoadCbcProjectData;
