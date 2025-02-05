import * as XLSX from 'xlsx';
import { performQuery } from '../graphql';
import {
  convertExcelDateToJSDate,
  convertExcelDropdownToBoolean,
} from '../sow_import/util';

const createMilestoneMutation = `
  mutation milestoneUploadMutation($input: CreateApplicationMilestoneExcelDataInput!) {
    createApplicationMilestoneExcelData(input: $input) {
        applicationMilestoneExcelData {
        id
        rowId
        jsonData
      }
      clientMutationId
    }
  }
`;

const readSummary = async (wb, sheets, applicationId, milestoneId) => {
  const projectUpdatesCentreSheet = XLSX.utils.sheet_to_json(
    wb.Sheets[sheets[0]],
    {
      header: 'A',
    }
  );

  const milestone1Sheet = XLSX.utils.sheet_to_json(wb.Sheets[sheets[1]], {
    header: 'A',
  });

  const milestone2Sheet = XLSX.utils.sheet_to_json(wb.Sheets[sheets[2]], {
    header: 'A',
  });

  const findProjectSitesHeader = (row) => {
    const data = row['A'];
    if (typeof data === 'string') {
      return data.toLowerCase() === 'Project Sites:'.toLowerCase();
    }
    return false;
  };

  const isEndOfMilestoneTable = (row) => {
    if (row === undefined) return false;

    return (
      row['A'] !== 'Land Access Agreement/Permit Update' &&
      (row['A'] !== undefined || row['A'] !== null)
    );
  };

  const milestoneOneProjectSiteArray = [];
  const milestoneOneHeaderStartPosition = milestone1Sheet.findIndex(
    findProjectSitesHeader
  );

  const milestoneTwoProjectSiteArray = [];
  const milestone2HeaderStartPosition = milestone2Sheet.findIndex(
    findProjectSitesHeader
  );

  const MILESTONE_2_PROGRESS_START_OFFSET = 1;
  const MILESTONE_2_APPLICABLE_START_OFFSET = 2;
  const MILESTONE_2_PROJECT_SITES_START_OFFEST = 4;

  for (
    let i = milestoneOneHeaderStartPosition + 1;
    isEndOfMilestoneTable(milestone1Sheet[i]);
    i++
  ) {
    const data = {
      projectSite: milestone1Sheet[i]['A'],
      siteId: milestone1Sheet[i]['C'],
      isPOP: milestone1Sheet[i]['D'],
      milestoneOneDueDate: milestone1Sheet[i]['E'],
      isRequired: convertExcelDropdownToBoolean(milestone1Sheet[i]['F']),
      isSubmitted: convertExcelDropdownToBoolean(milestone1Sheet[i]['G']),
      recipientComments: milestone1Sheet[i]['H'],
      status: milestone1Sheet[i]['I'],
      isedComments: milestone1Sheet[i]['J'],
    };
    milestoneOneProjectSiteArray.push(data);
  }

  const milestone2Progress = {
    landAccessPermitEvidence: {
      progress:
        milestone2Sheet[
          milestone2HeaderStartPosition + MILESTONE_2_PROGRESS_START_OFFSET
        ]['G'],
      applicable: convertExcelDropdownToBoolean(
        milestone2Sheet[
          milestone2HeaderStartPosition + MILESTONE_2_APPLICABLE_START_OFFSET
        ]['G']
      ),
    },
    radioAndSpectrumLicenses: {
      progress:
        milestone2Sheet[
          milestone2HeaderStartPosition + MILESTONE_2_PROGRESS_START_OFFSET
        ]['J'],
      applicable: convertExcelDropdownToBoolean(
        milestone2Sheet[
          milestone2HeaderStartPosition + MILESTONE_2_APPLICABLE_START_OFFSET
        ]['J']
      ),
    },
    photographsOfProjectSites: {
      progress:
        milestone2Sheet[
          milestone2HeaderStartPosition + MILESTONE_2_PROGRESS_START_OFFSET
        ]['M'],
      applicable: convertExcelDropdownToBoolean(
        milestone2Sheet[
          milestone2HeaderStartPosition + MILESTONE_2_APPLICABLE_START_OFFSET
        ]['M']
      ),
    },
    pointOfPresenceConfirmation: {
      progress:
        milestone2Sheet[
          milestone2HeaderStartPosition + MILESTONE_2_PROGRESS_START_OFFSET
        ]['P'],
      applicable: convertExcelDropdownToBoolean(
        milestone2Sheet[
          milestone2HeaderStartPosition + MILESTONE_2_APPLICABLE_START_OFFSET
        ]['P']
      ),
    },
  };

  for (
    let i =
      milestone2HeaderStartPosition + MILESTONE_2_PROJECT_SITES_START_OFFEST;
    isEndOfMilestoneTable(milestone2Sheet[i]);
    i++
  ) {
    const data = {
      detailedProgress: milestone2Progress,
      projectSite: milestone2Sheet[i]['A'],
      siteId: milestone2Sheet[i]['C'],
      isPOP: milestone2Sheet[i]['D'],
      milestoneTwoDueDate: milestone2Sheet[i]['E'],
      landAccessPermitEvidenceIsRequired: convertExcelDropdownToBoolean(
        milestone2Sheet[i]['F']
      ),
      landAccessPermitEvidenceIsSubmitted: convertExcelDropdownToBoolean(
        milestone2Sheet[i]['G']
      ),
      landAccessPermitEvidenceStatus: milestone2Sheet[i]['H'],
      radioAndSpectrumLicensesIsRequired: convertExcelDropdownToBoolean(
        milestone2Sheet[i]['I']
      ),
      radioAndSpectrumLicensesIsSubmitted: convertExcelDropdownToBoolean(
        milestone2Sheet[i]['J']
      ),
      radioandSpectrumLicensesStatus: milestone2Sheet[i]['K'],
      photographsOfProjectSitesIsRequired: convertExcelDropdownToBoolean(
        milestone2Sheet[i]['L']
      ),
      photographsOfProjectSitesIsSubmitted: convertExcelDropdownToBoolean(
        milestone2Sheet[i]['M']
      ),
      photographsOfProjectSitesStatus: milestone2Sheet[i]['N'],
      pointOfPresenceConfirmationIsRequired: convertExcelDropdownToBoolean(
        milestone2Sheet[i]['O']
      ),
      pointOfPresenceConfirmationIsSubmitted: convertExcelDropdownToBoolean(
        milestone2Sheet[i]['P']
      ),
      pointOfPresenceConfirmationStatus: milestone2Sheet[i]['Q'],
      recipientComments: milestone2Sheet[i]['R'],
      isedComments: milestone2Sheet[i]['S'],
    };
    milestoneTwoProjectSiteArray.push(data);
  }

  const jsonData = {
    projectNumber: projectUpdatesCentreSheet[3]['C'],
    milestone1Progress: projectUpdatesCentreSheet[4]['G'],
    milestone1ProjectSites: milestoneOneProjectSiteArray,
    milestone2Progress: projectUpdatesCentreSheet[5]['G'],
    milestone2ProjectSites: milestoneTwoProjectSiteArray,
    milestone3Progress: projectUpdatesCentreSheet[6]['G'],
    overallMilestoneProgress: projectUpdatesCentreSheet[7]['G'],
    milestone1DateOfReception: milestone1Sheet[15]['C']
      ? convertExcelDateToJSDate(milestone1Sheet[15]['C'])
      : '',
    milestone2DateOfReception: milestone2Sheet[5]['D']
      ? convertExcelDateToJSDate(milestone2Sheet[5]['D'])
      : '',
  };

  const milestoneData = {
    _applicationId: parseInt(applicationId, 10),
    _jsonData: jsonData,
    _oldId: milestoneId ? parseInt(milestoneId, 10) : null,
  };

  return milestoneData;
};

const ValidateData = async (data, req) => {
  const { ccbcNumber } = req.params;

  const { projectNumber } = data;

  const errors = [];
  if (
    projectNumber === undefined ||
    typeof projectNumber !== 'string' ||
    projectNumber !== ccbcNumber
  ) {
    const errorString = `CCBC Number mismatch: expected ${ccbcNumber}, received: ${projectNumber}`;
    if (!errors.find((err) => err.error === errorString))
      errors.push({
        error: `CCBC Number mismatch: expected ${ccbcNumber}, received: ${projectNumber}`,
      });
  }
  return errors;
};

const LoadMilestoneData = async (wb, sheets, req) => {
  const { applicationId, milestoneId } = req.params;
  const validate = req.query?.validate === 'true';

  const data = await readSummary(wb, sheets, applicationId, milestoneId);

  const errorList = await ValidateData(data._jsonData, req);

  if (errorList.length > 0) {
    return { error: errorList };
  }

  if (validate) {
    return data;
  }
  // time to persist in DB
  const result = await performQuery(
    createMilestoneMutation,
    {
      input: {
        _applicationId: data._applicationId,
        _jsonData: data._jsonData,
        _oldId: Number.isNaN(data._oldId) ? null : data._oldId,
      },
    },
    req
  ).catch((e) => {
    return { error: e };
  });
  return result;
};

export default LoadMilestoneData;
