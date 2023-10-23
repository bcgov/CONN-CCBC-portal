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
      applicantContractualName: project['H'],
      currentOperatingName: project['I'],
      eightThirtyMillionFunding: project['J'],
      federalFundingSource: project['K'],
      federalProjectNumber: project['L'],
      projectType: project['M'],
      transportProjectType: project['N'],
      highwayProjectType: project['O'],
      lastMileProjectType: project['P'],
      lastMileMinimumSpeed: project['Q'],
      connectedCoastNetworkDependant: project['R'],
      projectLocations: project['S'],
      communitiesAndLocalesCount: validateNumber(
        project['T'],
        'communitiesAndLocalesCount',
        errorLog,
        projectNumber
      ),
      indigenousCommunities: validateNumber(
        project['U'],
        'indigenousCommunities',
        errorLog,
        projectNumber
      ),
      householdCount: validateNumber(
        project['V'],
        'householdCount',
        errorLog,
        projectNumber
      ),
      transportKm: validateNumber(
        project['W'],
        'transportKm',
        errorLog,
        projectNumber
      ),
      highwayKm: validateNumber(
        project['X'],
        'highwayKm',
        errorLog,
        projectNumber
      ),
      restAreas: project['Y'],
      bcFundingRequest: validateNumber(
        project['Z'],
        'bcFundingRequest',
        errorLog,
        projectNumber
      ),
      federalFunding: validateNumber(
        project['AA'],
        'federalFunding',
        errorLog,
        projectNumber
      ),
      applicantAmount: validateNumber(
        project['AB'],
        'applicantAmount',
        errorLog,
        projectNumber
      ),
      otherFunding: validateNumber(
        project['AC'],
        'otherFunding',
        errorLog,
        projectNumber
      ),
      totalProjectBudget: validateNumber(
        project['AD'],
        'totalProjectBudget',
        errorLog,
        projectNumber
      ),
      nditConditionalApprovalLetterSent: project['AE'],
      bindingAgreementSignedNditRecipient: project['AF'],
      announcedByProvince: project['AG'],
      dateApplicationReceived: validateDate(
        project['AH'],
        'dateApplicationReceived',
        errorLog,
        projectNumber
      ),
      dateConditionallyApproved: validateDate(
        project['AI'],
        'dateConditionallyApproved',
        errorLog,
        projectNumber
      ),
      dateAgreementSigned: validateDate(
        project['AJ'],
        'dateAgreementSigned',
        errorLog,
        projectNumber
      ),
      proposedStartDate: validateDate(
        project['AK'],
        'proposedStartDate',
        errorLog,
        projectNumber
      ),
      proposedCompletionDate: validateDate(
        project['AL'],
        'proposedCompletionDate',
        errorLog,
        projectNumber
      ),
      reportingCompletionDate: validateDate(
        project['AM'],
        'reportingCompletionDate',
        errorLog,
        projectNumber
      ),
      dateAnnounced: validateDate(
        project['AN'],
        'dateAnnounced',
        errorLog,
        projectNumber
      ),
      projectMilestoneCompleted: validateNumber(
        project['AO'],
        'projectMilestoneCompleted',
        errorLog,
        projectNumber
      ),
      constructionCompletedOn: validateDate(
        project['AP'],
        'constructionCompletedOn',
        errorLog,
        projectNumber
      ),
      milestoneComments: project['AQ'],
      primaryNewsRelease: project['AR'],
      secondaryNewsRelease: project['AS'],
      notes: project['AT'],
      locked: project['AU'],
      lastReviewed: validateDate(
        project['AV'],
        'lastReviewed',
        errorLog,
        projectNumber
      ),
      reviewNotes: project['AW'],
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
