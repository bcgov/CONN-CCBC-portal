import * as XLSX from 'xlsx';
import { performQuery } from '../graphql';
/* import { convertExcelDateToJSDate } from '../sow_import/util'; */

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
  // remove the first element and the last 12 elements so we have only the project rows
  // this feels pretty unsafe, might be worth asking to remove the extra rows from the excel file
  const cbcProjects = cbcProjectsSheet.slice(1, cbcProjectsSheet.length - 12);

  cbcProjects.forEach((project) => {
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
      dateApplicationReceived: project['AG'],
      dateConditionallyApproved: project['AH'],
      dateAgreementSigned: project['AI'],
      proposedStartDate: project['AJ'],
      proposedCompletionDate: project['AK'],
      reportingCompletionDate: project['AL'],
      dateAnnounced: project['AM'],
      projectMilestoneCompleted: project['AN'],
      constructionCompletedOnTime: project['AO'],
      milestoneComments: project['AP'],
      primaryNewsRelease: project['AQ'],
      secondaryNewsRelease: project['AR'],
      notes: project['AS'],
      lastReviewed: project['AT'],
      reviewNotes: project['AU'],
    };

    cbcProjectList.push(cbcProject);
  });

  const cbcProjectData = {
    _jsonData: cbcProjectList,
  };

  return cbcProjectData;
};

const ValidateData = async (data) => {
  const errors = [];

  if (data.projectNumber === undefined) {
    errors.push({
      level: 'cell',
      error: `Invalid data: Project Number ${data.projectNumber}`,
    });
  }
  return errors;
};

const LoadCbcProjectData = async (wb, sheet, sharepointTimestamp, req) => {
  const validate = req.query?.validate === 'true';

  const data = await readSummary(wb, sheet);

  const errorList = await ValidateData(data._jsonData);

  if (errorList.length > 0) {
    return { error: errorList };
  }

  if (validate) {
    return data;
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
