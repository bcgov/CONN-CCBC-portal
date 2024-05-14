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

const findCbcQuery = `
  query findCbc($projectNumber: Int!) {
    cbcByProjectNumber (projectNumber: $projectNumber) {
      rowId
      cbcDataByProjectNumber {
        nodes {
          jsonData
          id
          projectNumber
          rowId
          sharepointTimestamp
        }
      }
    }
  }
`;

const createCbcMutation = `
  mutation createCbcMutation($input: CreateCbcInput!) {
    createCbc(input: $input) {
      clientMutationId
      cbc {
        rowId
      }
    }
  }
`;

const createCbcDataMutation = `
  mutation createCbcDataMutation($input: CreateCbcDataInput!) {
    createCbcData(input: $input) {
      clientMutationId
    }
  }
`;

const updateCbcDataMutation = `
mutation updateCbcDataMutation($input: UpdateCbcDataByRowIdInput!) {
  updateCbcDataByRowId(input: $input) {
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

    // trim all data
    Object.keys(project).forEach((key) => {
      if (typeof project[key] === 'string') {
        project[key] = project[key].trim();
      }
    });

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
      originalProjectNumber: project['B'],
      phase: project['C'],
      intake: project['D'],
      projectStatus: project['E'],
      changeRequestPending: project['F'],
      projectTitle: project['G'],
      projectDescription: project['H'],
      applicantContractualName: project['I'],
      currentOperatingName: project['J'],
      eightThirtyMillionFunding: project['K'],
      federalFundingSource: project['L'],
      federalProjectNumber: project['M'],
      projectType: project['N'],
      transportProjectType: project['O'],
      highwayProjectType: project['P'],
      lastMileProjectType: project['Q'],
      lastMileMinimumSpeed: project['R'],
      connectedCoastNetworkDependant: project['S'],
      projectLocations: project['T'],
      communitiesAndLocalesCount: validateNumber(
        project['U'],
        'communitiesAndLocalesCount',
        errorLog,
        projectNumber
      ),
      indigenousCommunities: validateNumber(
        project['V'],
        'indigenousCommunities',
        errorLog,
        projectNumber
      ),
      householdCount: validateNumber(
        project['W'],
        'householdCount',
        errorLog,
        projectNumber
      ),
      transportKm: validateNumber(
        project['X'],
        'transportKm',
        errorLog,
        projectNumber
      ),
      highwayKm: validateNumber(
        project['Y'],
        'highwayKm',
        errorLog,
        projectNumber
      ),
      restAreas: project['Z'],
      bcFundingRequest: validateNumber(
        project['AA'],
        'bcFundingRequest',
        errorLog,
        projectNumber
      ),
      federalFunding: validateNumber(
        project['AB'],
        'federalFunding',
        errorLog,
        projectNumber
      ),
      applicantAmount: validateNumber(
        project['AC'],
        'applicantAmount',
        errorLog,
        projectNumber
      ),
      otherFunding: validateNumber(
        project['AD'],
        'otherFunding',
        errorLog,
        projectNumber
      ),
      totalProjectBudget: validateNumber(
        project['AE'],
        'totalProjectBudget',
        errorLog,
        projectNumber
      ),
      nditConditionalApprovalLetterSent: project['AF'],
      bindingAgreementSignedNditRecipient: project['AG'],
      announcedByProvince: project['AH'],
      dateApplicationReceived: validateDate(
        project['AI'],
        'dateApplicationReceived',
        errorLog,
        projectNumber
      ),
      dateConditionallyApproved: validateDate(
        project['AJ'],
        'dateConditionallyApproved',
        errorLog,
        projectNumber
      ),
      dateAgreementSigned: validateDate(
        project['AK'],
        'dateAgreementSigned',
        errorLog,
        projectNumber
      ),
      proposedStartDate: validateDate(
        project['AL'],
        'proposedStartDate',
        errorLog,
        projectNumber
      ),
      proposedCompletionDate: validateDate(
        project['AM'],
        'proposedCompletionDate',
        errorLog,
        projectNumber
      ),
      reportingCompletionDate: validateDate(
        project['AN'],
        'reportingCompletionDate',
        errorLog,
        projectNumber
      ),
      dateAnnounced: validateDate(
        project['AO'],
        'dateAnnounced',
        errorLog,
        projectNumber
      ),
      projectMilestoneCompleted: validateNumber(
        project['AP'],
        'projectMilestoneCompleted',
        errorLog,
        projectNumber
      ),
      constructionCompletedOn: validateDate(
        project['AQ'],
        'constructionCompletedOn',
        errorLog,
        projectNumber
      ),
      milestoneComments: project['AR'],
      primaryNewsRelease: project['AS'],
      secondaryNewsRelease: project['AT'],
      notes: project['AU'],
      locked: project['AV'],
      lastReviewed: validateDate(
        project['AW'],
        'lastReviewed',
        errorLog,
        projectNumber
      ),
      reviewNotes: project['AX'],
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

  // persist into DB individually
  data._jsonData.forEach(async (project) => {
    // console.log(project);
    const findCbcProject = await performQuery(
      findCbcQuery,
      {
        projectNumber: project.projectNumber,
      },
      req
    );
    if (
      findCbcProject.data?.cbcByProjectNumber?.cbcDataByProjectNumber?.nodes
        .length > 0
    ) {
      // update cbc data
      await performQuery(
        updateCbcDataMutation,
        {
          input: {
            cbcDataPatch: {
              jsonData: project,
            },
            rowId:
              findCbcProject.data.cbcByProjectNumber.cbcDataByProjectNumber
                .nodes[0].rowId,
          },
        },
        req
      );
    } else {
      // create cbc
      const createCbcResult = await performQuery(
        createCbcMutation,
        {
          input: {
            cbc: {
              projectNumber: project.projectNumber,
              sharepointTimestamp,
            },
          },
        },
        req
      );
      // create cbc data
      await performQuery(
        createCbcDataMutation,
        {
          input: {
            cbcData: {
              jsonData: project,
              projectNumber: project.projectNumber,
              cbcId: createCbcResult.data.createCbc.cbc.rowId,
              sharepointTimestamp,
            },
          },
        },
        req
      );
    }
  });

  return {
    ...result,
    errorLog: cbcErrorList,
  };
};

export default LoadCbcProjectData;
