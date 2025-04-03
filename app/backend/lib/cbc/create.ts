import { performQuery } from '../graphql';

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

const baseCbcProject = {
  projectNumber: null,
  originalProjectNumber: null,
  phase: null,
  intake: null,
  projectStatus: null,
  changeRequestPending: null,
  projectTitle: null,
  projectDescription: null,
  applicantContractualName: null,
  currentOperatingName: null,
  eightThirtyMillionFunding: null,
  federalFundingSource: null,
  federalProjectNumber: null,
  projectType: null,
  transportProjectType: null,
  highwayProjectType: null,
  lastMileProjectType: null,
  lastMileMinimumSpeed: null,
  connectedCoastNetworkDependant: null,
  projectLocations: null,
  communitiesAndLocalesCount: null,
  indigenousCommunities: null,
  householdCount: null,
  transportKm: null,
  highwayKm: null,
  restAreas: null,
  bcFundingRequested: null,
  federalFundingRequested: null,
  applicantAmount: null,
  otherFundingRequested: null,
  totalProjectBudget: null,
  conditionalApprovalLetterSent: null,
  agreementSigned: null,
  announcedByProvince: null,
  dateApplicationReceived: null,
  dateConditionallyApproved: null,
  dateAgreementSigned: null,
  proposedStartDate: null,
  proposedCompletionDate: null,
  reportingCompletionDate: null,
  dateAnnounced: null,
  projectMilestoneCompleted: null,
  constructionCompletedOn: null,
  milestoneComments: null,
  primaryNewsRelease: null,
  secondaryNewsRelease: null,
  notes: null,
  locked: null,
  lastReviewed: null,
  reviewNotes: null,
  errorLog: null,
};

const createCbcProject = async (
  projectNumber,
  projectTitle,
  externalStatus,
  projectType,
  req
) => {
  const projectData = {
    ...baseCbcProject,
    projectNumber,
    projectTitle,
    projectStatus: externalStatus,
    projectType,
  };
  let createCbcResult = null;
  // create cbc
  createCbcResult = await performQuery(
    createCbcMutation,
    {
      input: {
        cbc: {
          projectNumber: projectData.projectNumber,
        },
      },
    },
    req
  );
  if (createCbcResult?.errors) {
    return {
      error: createCbcResult.errors,
    };
  }
  const cbcRowId = createCbcResult?.data?.createCbc?.cbc?.rowId;
  // create cbc data
  await performQuery(
    createCbcDataMutation,
    {
      input: {
        cbcData: {
          jsonData: projectData,
          projectNumber: projectData.projectNumber,
          cbcId: cbcRowId,
        },
      },
    },
    req
  );
  return {
    rowId: cbcRowId,
    error: null,
  };
};

export default createCbcProject;
