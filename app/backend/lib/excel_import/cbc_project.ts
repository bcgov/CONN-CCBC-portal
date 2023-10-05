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

const validateNumber = (value, fieldName, errorList) => {
  if (!value) {
    return null;
  }
  if (typeof value === 'number') {
    return value;
  }

  errorList.push(
    `${fieldName} not imported due to formatting error - value should be a number`
  );
  return null;
};

const validateDate = (value, fieldName, errorList) => {
  if (!value) {
    return null;
  }
  if (typeof value === 'number') {
    return convertExcelDateToJSDate(value);
  }

  errorList.push(
    `${fieldName} not imported due to formatting error - value should be a date`
  );
  return null;
};

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
      communitiesAndLocalesCount: validateNumber(
        project['S'],
        'communitiesAndLocalesCount',
        errorLog
      ),
      indigenousCommunities: validateNumber(
        project['T'],
        'indigenousCommunities',
        errorLog
      ),
      householdCount: validateNumber(project['U'], 'householdCount', errorLog),
      transportKm: validateNumber(project['V'], 'transportKm', errorLog),
      highwayKm: validateNumber(project['W'], 'highwayKm', errorLog),
      restAreas: project['X'],
      bcFundingRequest: validateNumber(
        project['Y'],
        'bcFundingRequest',
        errorLog
      ),
      federalFunding: validateNumber(project['Z'], 'federalFunding', errorLog),
      applicantAmount: validateNumber(
        project['AA'],
        'applicantAmount',
        errorLog
      ),
      otherFunding: validateNumber(project['AB'], 'otherFunding', errorLog),
      totalProjectBudget: validateNumber(
        project['AC'],
        'totalProjectBudget',
        errorLog
      ),
      nditConditionalApprovalLetterSent: project['AD'],
      bindingAgreementSignedNditRecipient: project['AE'],
      announcedByProvince: project['AF'],
      dateApplicationReceived: validateDate(
        project['AG'],
        'dateApplicationReceived',
        errorLog
      ),
      dateConditionallyApproved: validateDate(
        project['AH'],
        'dateConditionallyApproved',
        errorLog
      ),
      dateAgreementSigned: validateDate(
        project['AI'],
        'dateAgreementSigned',
        errorLog
      ),
      proposedStartDate: validateDate(
        project['AJ'],
        'proposedStartDate',
        errorLog
      ),
      proposedCompletionDate: validateDate(
        project['AK'],
        'proposedCompletionDate',
        errorLog
      ),
      reportingCompletionDate: validateDate(
        project['AL'],
        'reportingCompletionDate',
        errorLog
      ),
      dateAnnounced: validateDate(project['AM'], 'dateAnnounced', errorLog),
      projectMilestoneCompleted: validateDate(
        project['AN'],
        'projectMilestoneCompleted',
        errorLog
      ),

      constructionCompletedOn: validateDate(
        project['AO'],
        'constructionCompletedOn',
        errorLog
      ),
      milestoneComments: project['AP'],
      primaryNewsRelease: project['AQ'],
      secondaryNewsRelease: project['AR'],
      notes: project['AS'],
      locked: project['AT'],
      lastReviewed: validateDate(project['AU'], 'lastReviewed', errorLog),
      reviewNotes: project['AV'],
      errorLog,
    };

    cbcProjectList.push(cbcProject);
  });

  /*   console.log('cbcProjectList', cbcProjectList); */

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
