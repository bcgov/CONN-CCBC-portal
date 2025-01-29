import * as XLSX from 'xlsx';
import { DateTime } from 'luxon';
import { performQuery } from '../graphql';
import { convertExcelDateToJSDate } from '../sow_import/util';

const createClaimsMutation = `
  mutation claimsUploadMutation($input: CreateApplicationClaimsExcelDataInput!) {
    createApplicationClaimsExcelData(input:   $input) {
        applicationClaimsExcelData {
        id
        rowId
      }
      clientMutationId
    }
  }
`;
const firstTenRowLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

const checkFirstTenColumns = (
  claimsRequestFormSheet: Array<any>,
  flagFunction: Function,
  index: number
) => {
  return firstTenRowLetters.some((column) => {
    if (
      claimsRequestFormSheet[index] &&
      claimsRequestFormSheet[index][column]
    ) {
      return flagFunction(claimsRequestFormSheet[index][column]);
    }
    return false;
  });
};

/// Get Claim Ruquest Form Fields

const getDateRequestReceived = (
  claimsRequestFormSheet: Array<any>,
  index: number
) => {
  let dateRequestReceived = null;
  firstTenRowLetters.forEach((letter) => {
    if (
      claimsRequestFormSheet[index][letter] &&
      convertExcelDateToJSDate(claimsRequestFormSheet[index][letter])
    ) {
      dateRequestReceived = claimsRequestFormSheet[index][letter];
    }
  });
  return convertExcelDateToJSDate(dateRequestReceived);
};

const getBcProjectNumber = (
  claimsRequestFormSheet: Array<any>,
  index: number
) => {
  let bcProjectNumber;
  firstTenRowLetters.forEach((letter) => {
    if (
      claimsRequestFormSheet[index][letter] &&
      typeof claimsRequestFormSheet[index][letter] === 'string' &&
      /^CCBC-\d{6}$/.test(claimsRequestFormSheet[index][letter].trim())
    ) {
      bcProjectNumber = claimsRequestFormSheet[index][letter];
    }
  });
  return bcProjectNumber;
};

const getIsedProjectNumber = (
  claimsRequestFormSheet: Array<any>,
  index: number
) => {
  let isedProjectNumber = null;
  firstTenRowLetters.forEach((letter) => {
    if (
      claimsRequestFormSheet[index][letter] &&
      typeof claimsRequestFormSheet[index][letter] === 'number'
    ) {
      isedProjectNumber = claimsRequestFormSheet[index][letter];
    }
  });
  return isedProjectNumber;
};

const getClaimNumber = (claimsRequestFormSheet: Array<any>, index: number) => {
  let claimNumber;
  firstTenRowLetters.forEach((letter) => {
    if (
      claimsRequestFormSheet[index][letter] &&
      typeof claimsRequestFormSheet[index][letter] === 'number' &&
      !claimNumber
    ) {
      claimNumber = claimsRequestFormSheet[index][letter];
    }
  });
  return claimNumber;
};

const getEligibleCostsIncurredFromDate = (
  claimsRequestFormSheet: Array<any>,
  index: number
) => {
  let eligibleCostsIncurredFromDate = null;
  firstTenRowLetters.forEach((letter) => {
    if (
      claimsRequestFormSheet[index][letter] &&
      // excel date is of type number
      typeof claimsRequestFormSheet[index][letter] === 'number' &&
      // we only want the first value since there are others after
      eligibleCostsIncurredFromDate === null
    ) {
      eligibleCostsIncurredFromDate = claimsRequestFormSheet[index][letter];
    }
  });
  return convertExcelDateToJSDate(eligibleCostsIncurredFromDate);
};

const getEligibleCostsIncurredToDate = (
  claimsRequestFormSheet: Array<any>,
  index: number
) => {
  let eligibleCostsIncurredToDate = null;
  firstTenRowLetters.forEach((letter) => {
    if (
      claimsRequestFormSheet[index][letter] &&
      // excel date is of type number
      typeof claimsRequestFormSheet[index][letter] === 'number' &&
      // we only want the first value since there are others after
      eligibleCostsIncurredToDate === null
    ) {
      eligibleCostsIncurredToDate = claimsRequestFormSheet[index][letter];
    }
  });
  return convertExcelDateToJSDate(eligibleCostsIncurredToDate);
};

/// Get Progress Report Fields

const isValidProgressReportInput = (input) => {
  const validInputs = [
    'Not Started',
    'In Progress',
    'Completed',
    'N/A',
    'Yes',
    'No',
  ];

  return (
    input &&
    validInputs.some(
      (validInput) =>
        validInput?.trim()?.toLowerCase() === input?.trim()?.toLowerCase()
    )
  );
};

const getProgressOnPermits = (
  progressReportSheet: Array<any>,
  index: number
) => {
  let progressOnPermits = null;
  firstTenRowLetters.forEach((letter) => {
    if (
      progressReportSheet[index][letter] &&
      isValidProgressReportInput(progressReportSheet[index][letter])
    ) {
      progressOnPermits = progressReportSheet[index][letter];
    }
  });
  return progressOnPermits;
};

const getHasConstructionBegun = (
  progressReportSheet: Array<any>,
  index: number
) => {
  let hasConstructionBegun = null;
  firstTenRowLetters.forEach((letter) => {
    if (
      progressReportSheet[index][letter] &&
      isValidProgressReportInput(progressReportSheet[index][letter])
    ) {
      hasConstructionBegun = progressReportSheet[index][letter];
    }
  });
  return hasConstructionBegun;
};

const getHaveServicesBeenOffered = (
  progressReportSheet: Array<any>,
  index: number
) => {
  let haveServicesBeenOffered = null;
  firstTenRowLetters.forEach((letter) => {
    if (
      progressReportSheet[index][letter] &&
      isValidProgressReportInput(progressReportSheet[index][letter])
    ) {
      haveServicesBeenOffered = progressReportSheet[index][letter];
    }
  });
  return haveServicesBeenOffered;
};

const getProjectScheduleRisks = (
  progressReportSheet: Array<any>,
  index: number
) => {
  let projectScheduleRisks = null;
  firstTenRowLetters.forEach((letter) => {
    if (
      progressReportSheet[index][letter] &&
      isValidProgressReportInput(progressReportSheet[index][letter])
    ) {
      projectScheduleRisks = progressReportSheet[index][letter];
    }
  });
  return projectScheduleRisks;
};

const getThirdPartyPassiveInfrastructure = (
  progressReportSheet: Array<any>,
  index: number
) => {
  let thirdPartyPassiveInfrastructure = null;
  firstTenRowLetters.forEach((letter) => {
    if (
      progressReportSheet[index][letter] &&
      isValidProgressReportInput(progressReportSheet[index][letter])
    ) {
      thirdPartyPassiveInfrastructure = progressReportSheet[index][letter];
    }
  });
  return thirdPartyPassiveInfrastructure;
};

const getCommunicationMaterials = (
  progressReportSheet: Array<any>,
  index: number
) => {
  let communicationMaterials = null;
  firstTenRowLetters.forEach((letter) => {
    if (
      progressReportSheet[index][letter] &&
      isValidProgressReportInput(progressReportSheet[index][letter])
    ) {
      communicationMaterials = progressReportSheet[index][letter];
    }
  });
  return communicationMaterials;
};

const getProjectBudgetRisks = (
  progressReportSheet: Array<any>,
  index: number
) => {
  let projectBudgetRisks = null;
  firstTenRowLetters.forEach((letter) => {
    if (
      progressReportSheet[index][letter] &&
      isValidProgressReportInput(progressReportSheet[index][letter])
    ) {
      projectBudgetRisks = progressReportSheet[index][letter];
    }
  });
  return projectBudgetRisks;
};

const getChangesToOverallBudget = (
  progressReportSheet: Array<any>,
  index: number
) => {
  let changesToOverallBudget = null;
  firstTenRowLetters.forEach((letter) => {
    if (
      progressReportSheet[index][letter] &&
      isValidProgressReportInput(progressReportSheet[index][letter])
    ) {
      changesToOverallBudget = progressReportSheet[index][letter];
    }
  });
  return changesToOverallBudget;
};

/// Claims Request Form Flags

const isDateRequestedReceivedFlag = (dateStringFlag: any) => {
  if (typeof dateStringFlag !== 'string') {
    return false;
  }
  return (
    dateStringFlag?.toLowerCase()?.trim() ===
      'Date Request Received (ISED CCBC input) (YYYY-MM-DD)'
        ?.toLowerCase()
        ?.trim() ||
    dateStringFlag?.toLowerCase()?.trim() ===
      'Date Request Received (ISED/CCBC input) (YYYY-MM-DD)'
        ?.toLowerCase()
        ?.trim()
  );
};

const isBcProjectNumberFlag = (projectNumberFlag: any) => {
  if (typeof projectNumberFlag !== 'string') {
    return false;
  }
  const bcProjectNumberStringNewClaims = 'BC Project No.';
  const bcProjectNumberFlagOldClaims = 'Project No.';
  return (
    projectNumberFlag?.toLowerCase()?.trim() ===
      bcProjectNumberStringNewClaims?.toLowerCase()?.trim() ||
    projectNumberFlag?.toLowerCase()?.trim() ===
      bcProjectNumberFlagOldClaims?.toLowerCase()?.trim()
  );
};

const isIsedProjectNumberFlag = (projectNumberFlag: any) => {
  if (typeof projectNumberFlag !== 'string') {
    return false;
  }
  const isedProjectNumberString = 'ISED Project No.';
  return (
    projectNumberFlag?.toLowerCase()?.trim() ===
    isedProjectNumberString?.toLowerCase()?.trim()
  );
};

const isClaimNumberFlag = (claimNumberFlag: any) => {
  if (typeof claimNumberFlag !== 'string') {
    return false;
  }
  const claimNumberString = 'Claim No.';
  return (
    claimNumberFlag?.toLowerCase()?.trim() ===
    claimNumberString?.toLowerCase()?.trim()
  );
};

const isEligibleCostsIncurredFromDateFlag = (
  eligibleCostsIncurredFromDateFlag: any
) => {
  if (typeof eligibleCostsIncurredFromDateFlag !== 'string') {
    return false;
  }
  const eligibleCostsIncurredFromDateString = 'From (YYYY-MM-DD):';
  return (
    eligibleCostsIncurredFromDateFlag?.toLowerCase()?.trim() ===
    eligibleCostsIncurredFromDateString?.toLowerCase()?.trim()
  );
};

const isEligibleCostsIncurredToDateFlag = (
  eligibleCostsIncurredToDateFlag: any
) => {
  if (typeof eligibleCostsIncurredToDateFlag !== 'string') {
    return false;
  }
  const eligibleCostsIncurredFromDateString = 'To (YYYY-MM-DD):';
  return (
    eligibleCostsIncurredToDateFlag?.toLowerCase()?.trim() ===
    eligibleCostsIncurredFromDateString?.toLowerCase()?.trim()
  );
};

/// Progress Report Flags

const isProgressOnPermitsFlag = (progressOnPermitsFlag: any) => {
  if (typeof progressOnPermitsFlag !== 'string') {
    return false;
  }
  const progressOnPermitsString =
    '1.a) Progress on Permits/ land access / spectrum licensing / etc. ';
  return (
    progressOnPermitsFlag?.toLowerCase()?.trim() ===
    progressOnPermitsString?.toLowerCase()?.trim()
  );
};

const isHasConstructionBegunFlag = (hasConstructionBegunFlag: any) => {
  if (typeof hasConstructionBegunFlag !== 'string') {
    return false;
  }
  const hasConstructionBegunString = '1.b) Has construction begun? ';
  return (
    hasConstructionBegunFlag?.toLowerCase()?.trim() ===
    hasConstructionBegunString?.toLowerCase()?.trim()
  );
};

const isHaveServicesBeenOfferedFlag = (haveServicesBeenOfferedFlag: any) => {
  if (typeof haveServicesBeenOfferedFlag !== 'string') {
    return false;
  }
  const haveServicesBeenOfferedString =
    '1.c) Have services begun being offered to households? For Mobile Wireless projects, are mobile services available to communities or along roads?';
  return (
    haveServicesBeenOfferedFlag?.toLowerCase()?.trim() ===
    haveServicesBeenOfferedString?.toLowerCase()?.trim()
  );
};

const isProjectScheduleRisksFlag = (projectScheduleRisksFlag: any) => {
  if (typeof projectScheduleRisksFlag !== 'string') {
    return false;
  }
  const projectScheduleRisksString =
    '2. Have any issues or risks been encountered that may affect the current project schedule or completion date of the Project? Provide details including the related risk mitigation strategies.';
  return (
    projectScheduleRisksFlag?.toLowerCase()?.trim() ===
    projectScheduleRisksString?.toLowerCase()?.trim()
  );
};

const isThirdPartyPassiveInfrastructureFlag = (thirdPartyFlag: any) => {
  if (typeof thirdPartyFlag !== 'string') {
    return false;
  }
  const thirdPartyString =
    '3. Have you encountered issues in your requests to access a third party’s passive infrastructure?  If yes, provide details and any mitigation strategies.';

  return (
    thirdPartyFlag?.toLowerCase()?.trim() ===
    thirdPartyString?.toLowerCase()?.trim()
  );
};

const isCommunicationMaterialsFlag = (communicationMaterialsFlag: any) => {
  if (typeof communicationMaterialsFlag !== 'string') {
    return false;
  }
  const communicationMaterialsString =
    '4. Have there been any Communication Materials or Products produced? Provide any relevant documents or website link, if applicable.';

  return (
    communicationMaterialsFlag?.toLowerCase()?.trim() ===
    communicationMaterialsString?.toLowerCase()?.trim()
  );
};

const isProjectBudgetRisks = (projectBudgetRisksFlag: any) => {
  if (typeof projectBudgetRisksFlag !== 'string') {
    return false;
  }
  const isProjectBudgetRisksString =
    '5. Have any issues or risks been encountered that may affect the project budget? Provide details including the related risk mitigation strategies.';

  return (
    projectBudgetRisksFlag?.toLowerCase()?.trim() ===
    isProjectBudgetRisksString?.toLowerCase()?.trim()
  );
};

const isChangesToOverallBudgetFlag = (changesToOverallBudgetFlag: any) => {
  if (typeof changesToOverallBudgetFlag !== 'string') {
    return false;
  }
  const isChangesToOverallBudgetString =
    '6. Have there been changes to the overall budget? If so, update below.';

  return (
    changesToOverallBudgetFlag?.toLowerCase()?.trim() ===
    isChangesToOverallBudgetString?.toLowerCase()?.trim()
  );
};

const readSummary = async (wb, sheet_1, sheet_2, applicationId, claimsId) => {
  const claimsRequestFormSheet = XLSX.utils.sheet_to_json(wb.Sheets[sheet_1], {
    header: 'A',
  });

  const progressReportSheet = XLSX.utils.sheet_to_json(wb.Sheets[sheet_2], {
    header: 'A',
  });

  // Claims Request Form sheet fields

  let dateRequestReceived = null;
  let isedProjectNumber = null;
  let projectNumber = null;
  let claimNumber = null;
  let eligibleCostsIncurredFromDate = null;
  let eligibleCostsIncurredToDate = null;
  for (let i = 0; i < 50; i++) {
    if (
      checkFirstTenColumns(
        claimsRequestFormSheet,
        isDateRequestedReceivedFlag,
        i
      )
    ) {
      dateRequestReceived = getDateRequestReceived(claimsRequestFormSheet, i);
    }
    if (
      checkFirstTenColumns(claimsRequestFormSheet, isBcProjectNumberFlag, i)
    ) {
      projectNumber = getBcProjectNumber(claimsRequestFormSheet, i);
    }
    if (
      checkFirstTenColumns(claimsRequestFormSheet, isIsedProjectNumberFlag, i)
    ) {
      isedProjectNumber = getIsedProjectNumber(claimsRequestFormSheet, i);
    }
    if (checkFirstTenColumns(claimsRequestFormSheet, isClaimNumberFlag, i)) {
      claimNumber = getClaimNumber(claimsRequestFormSheet, i);
    }
    if (
      checkFirstTenColumns(
        claimsRequestFormSheet,
        isEligibleCostsIncurredFromDateFlag,
        i
      )
    ) {
      eligibleCostsIncurredFromDate = getEligibleCostsIncurredFromDate(
        claimsRequestFormSheet,
        i
      );
    }
    if (
      checkFirstTenColumns(
        claimsRequestFormSheet,
        isEligibleCostsIncurredToDateFlag,
        i
      )
    ) {
      eligibleCostsIncurredToDate = getEligibleCostsIncurredToDate(
        claimsRequestFormSheet,
        i
      );
    }
  }

  // Progress Report sheet fields
  let progressOnPermits = null;
  let hasConstructionBegun = null;
  let haveServicesBeenOffered = null;
  let projectScheduleRisks = null;
  let thirdPartyPassiveInfrastructure = null;
  let commincationMaterials = null;
  let projectBudgetRisks = null;
  let changesToOverallBudget = null;

  for (let i = 0; i < 50; i++) {
    if (checkFirstTenColumns(progressReportSheet, isProgressOnPermitsFlag, i)) {
      progressOnPermits = getProgressOnPermits(progressReportSheet, i);
    }
    if (
      checkFirstTenColumns(progressReportSheet, isHasConstructionBegunFlag, i)
    ) {
      hasConstructionBegun = getHasConstructionBegun(progressReportSheet, i);
    }
    if (
      checkFirstTenColumns(
        progressReportSheet,
        isHaveServicesBeenOfferedFlag,
        i
      )
    ) {
      haveServicesBeenOffered = getHaveServicesBeenOffered(
        progressReportSheet,
        i
      );
    }
    if (
      checkFirstTenColumns(progressReportSheet, isProjectScheduleRisksFlag, i)
    ) {
      projectScheduleRisks = getProjectScheduleRisks(progressReportSheet, i);
    }
    if (
      checkFirstTenColumns(
        progressReportSheet,
        isThirdPartyPassiveInfrastructureFlag,
        i
      )
    ) {
      thirdPartyPassiveInfrastructure = getThirdPartyPassiveInfrastructure(
        progressReportSheet,
        i
      );
    }
    if (
      checkFirstTenColumns(progressReportSheet, isCommunicationMaterialsFlag, i)
    ) {
      commincationMaterials = getCommunicationMaterials(progressReportSheet, i);
    }
    if (checkFirstTenColumns(progressReportSheet, isProjectBudgetRisks, i)) {
      projectBudgetRisks = getProjectBudgetRisks(progressReportSheet, i);
    }
    if (
      checkFirstTenColumns(progressReportSheet, isChangesToOverallBudgetFlag, i)
    ) {
      changesToOverallBudget = getChangesToOverallBudget(
        progressReportSheet,
        i
      );
    }
  }

  const jsonData = {
    dateRequestReceived,
    projectNumber,
    isedProjectNumber,
    claimNumber,
    eligibleCostsIncurredFromDate,
    eligibleCostsIncurredToDate,
    progressOnPermits,
    hasConstructionBegun,
    haveServicesBeenOffered,
    projectScheduleRisks,
    thirdPartyPassiveInfrastructure,
    commincationMaterials,
    projectBudgetRisks,
    changesToOverallBudget,
  };

  const claimsData = {
    _applicationId: parseInt(applicationId, 10),
    _jsonData: jsonData,
    _oldId: claimsId ? parseInt(claimsId, 10) : null,
  };

  return claimsData;
};

const ValidateData = async (data, req) => {
  const { ccbcNumber, applicationId, claimsId, excelDataId } = req.params;
  const {
    claimNumber,
    dateRequestReceived,
    projectNumber,
    eligibleCostsIncurredFromDate,
    eligibleCostsIncurredToDate,
  } = data;

  // get all previous claims for this applications
  const claims: any = await performQuery(
    `
    query ClaimQuery {
      applicationByRowId(rowId: ${applicationId}) {
        applicationClaimsExcelDataByApplicationId(filter: {archivedAt: {isNull: true}}) {
          nodes {
            rowId
            jsonData
          }
        }
      }
    }
    `,
    {},
    req
  ).catch((e) => {
    return { error: e };
  });

  // get an array of all previous used claim numebers
  const previousClaimNumbers =
    claims?.data?.applicationByRowId?.applicationClaimsExcelDataByApplicationId?.nodes?.map(
      (claim) => {
        return claim.jsonData.claimNumber;
      }
    );

  const errors = [];

  if (claimNumber === undefined) {
    errors.push({
      level: 'cell',
      error: 'Invalid data: Claim number',
    });
  }

  if (previousClaimNumbers?.includes(claimNumber) && claimsId === 'undefined') {
    errors.push({
      level: 'claimNumber',
      error: `Check that it's the correct file and retry uploading. If you were trying to edit an existing claim, please click the edit button beside it.`,
    });
  }

  // we are processing an edit
  if (claimsId !== 'undefined' && excelDataId !== 'undefined') {
    // find matching existing claim excel data
    const existingClaim =
      claims?.data?.applicationByRowId?.applicationClaimsExcelDataByApplicationId?.nodes?.find(
        (claim) => {
          return claim.rowId === parseInt(excelDataId, 10);
        }
      );
    if (
      existingClaim === undefined ||
      existingClaim.jsonData.claimNumber !== data.claimNumber
    ) {
      errors.push({
        error: 'The claim number does not match the claim number being edited.',
      });
    }
  }

  if (dateRequestReceived === undefined || dateRequestReceived === null) {
    errors.push({
      level: 'cell',
      error: 'Invalid data: Date request received',
    });
  }

  if (
    eligibleCostsIncurredFromDate === undefined ||
    DateTime.fromISO(eligibleCostsIncurredFromDate).invalidReason
  ) {
    errors.push({
      level: 'cell',
      error: 'Invalid data: Eligible costs incurred from date',
    });
  }

  if (
    eligibleCostsIncurredToDate === undefined ||
    DateTime.fromISO(eligibleCostsIncurredToDate).invalidReason
  ) {
    errors.push({
      level: 'cell',
      error: 'Invalid data: Eligible costs incurred to date',
    });
  }

  if (
    eligibleCostsIncurredFromDate &&
    eligibleCostsIncurredToDate &&
    eligibleCostsIncurredFromDate > eligibleCostsIncurredToDate
  ) {
    errors.push({
      level: 'cell',
      error:
        'Invalid data: Eligible costs incurred from date cannot be greater than eligible costs incurred to date',
    });
  }

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

const LoadClaimsData = async (wb, sheet_1, sheet_2, req) => {
  const { applicationId, claimsId } = req.params;
  const validate = req.query?.validate === 'true';

  const data = await readSummary(wb, sheet_1, sheet_2, applicationId, claimsId);

  const errorList = await ValidateData(data._jsonData, req);

  if (errorList.length > 0) {
    return { error: errorList };
  }

  if (validate) {
    return data;
  }
  // time to persist in DB
  const result = await performQuery(
    createClaimsMutation,
    {
      input: {
        _applicationId: data._applicationId,
        _jsonData: data._jsonData,
      },
    },
    req
  ).catch((e) => {
    return { error: e };
  });

  return result;
};

export default LoadClaimsData;
