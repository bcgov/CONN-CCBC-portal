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

const getEligibleCostsClaimed = (
  claimsRequestFormSheet: Array<any>,
  index: number,
  column: string
) => {
  if (
    claimsRequestFormSheet[index] &&
    claimsRequestFormSheet[index][column] &&
    typeof claimsRequestFormSheet[index][column] === 'string' &&
    claimsRequestFormSheet[index][column] !==
      'Select Option from Drop Down Menu to describe if Costs were Incurred and/or Paid'
  ) {
    return claimsRequestFormSheet[index][column];
  }
  return null;
};

const getTotalEligibleCostsClaimed = (
  claimsRequestFormSheet: Array<any>,
  index: number,
  column: string
) => {
  if (
    claimsRequestFormSheet[index] &&
    claimsRequestFormSheet[index][column] &&
    typeof claimsRequestFormSheet[index][column] === 'number'
  ) {
    return claimsRequestFormSheet[index][column];
  }
  return null;
};

const getIsedShareFromClaimPayment = (
  claimsRequestFormSheet: Array<any>,
  index: number,
  column: string
) => {
  if (
    claimsRequestFormSheet[index] &&
    claimsRequestFormSheet[index][column] &&
    typeof claimsRequestFormSheet[index][column] === 'number'
  ) {
    return claimsRequestFormSheet[index][column];
  }
  return null;
};

const getBcShareFromClaimPayment = (
  claimsRequestFormSheet: Array<any>,
  index: number,
  column: string
) => {
  if (
    claimsRequestFormSheet[index] &&
    claimsRequestFormSheet[index][column] &&
    typeof claimsRequestFormSheet[index][column] === 'number'
  ) {
    return claimsRequestFormSheet[index][column];
  }
  return null;
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

/// Budget Table Functions

const extractFiscalYear = (headerText: string): string | null => {
  if (typeof headerText !== 'string') return null;

  // Match patterns like "2022-2023", "2023-2024", "2023-24", etc.
  const fiscalYearMatch = headerText.match(/(\d{4})-(\d{2,4})/);
  if (fiscalYearMatch) {
    const startYear = fiscalYearMatch[1];
    const endYearPart = fiscalYearMatch[2];

    // Handle both full year (2023) and short year (24) formats
    let endYear = endYearPart;
    if (endYearPart.length === 2) {
      // Convert 2-digit year to 4-digit year
      const century = startYear.substring(0, 2);
      endYear = century + endYearPart;
    }

    return `${startYear}-${endYear}`;
  }

  return null;
};

const safeParseFloat = (value: any): number => {
  const numericValue = typeof value === 'number' ? value : parseFloat(value);
  return !Number.isNaN(numericValue) ? numericValue : 0;
};

const parseProjectBudgetByGovernmentFY = (
  progressReportSheet: Array<any>,
  startRowIndex: number
): Array<any> => {
  const budgetData = [];
  const allColumns = [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
  ];

  // The fiscal year headers are in the first row (startRowIndex)
  // Extract fiscal years from all columns
  const fiscalYears = [];
  allColumns.forEach((col) => {
    const cellValue =
      progressReportSheet[startRowIndex] &&
      progressReportSheet[startRowIndex][col];
    if (cellValue) {
      const fiscalYear = extractFiscalYear(cellValue.toString());
      if (fiscalYear) {
        fiscalYears.push({ fiscalYear, column: col });
      }
    }
  });

  if (fiscalYears.length === 0) return budgetData;

  // Parse the budget rows - they are in fixed positions after the header
  // Row 1: Eligible Costs
  // Row 2: Ineligible Costs
  // Row 3: Total Project Costs
  const budgetRowMappings = [
    { rowOffset: 1, key: 'eligibleCost' },
    { rowOffset: 2, key: 'ineligibleCost' },
    { rowOffset: 3, key: 'totalProjectCost' },
  ];

  fiscalYears.forEach(({ fiscalYear, column }) => {
    const fiscalData = { fiscal: fiscalYear };

    budgetRowMappings.forEach(({ rowOffset, key }) => {
      const currentRowIndex = startRowIndex + rowOffset;
      if (progressReportSheet[currentRowIndex]) {
        const value = progressReportSheet[currentRowIndex][column];
        if (value !== undefined && value !== null && value !== '') {
          fiscalData[key] = safeParseFloat(value);
        }
      }
    });

    // Only add fiscal data if it has at least one budget value
    const hasData = Object.keys(fiscalData).length > 1; // more than just 'fiscal'
    if (hasData) {
      budgetData.push(fiscalData);
    }
  });

  return budgetData;
};

const parseUpdatedProvincialContributionByQuarter = (
  progressReportSheet: Array<any>,
  startRowIndex: number
): Array<any> => {
  const quarterlyData = [];
  const allColumns = [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
  ];

  // The forecast headers are in the next row after the startRowIndex
  const headerRowIndex = startRowIndex + 1;

  if (!progressReportSheet[headerRowIndex]) return quarterlyData;

  // Extract fiscal years from forecast headers
  const fiscalYears = [];
  allColumns.forEach((col) => {
    const cellValue = progressReportSheet[headerRowIndex][col];
    if (cellValue && cellValue.toString().toLowerCase().includes('forecast')) {
      const fiscalYear = extractFiscalYear(cellValue.toString());
      if (fiscalYear) {
        fiscalYears.push({ fiscalYear, column: col });
      }
    }
  });

  if (fiscalYears.length === 0) return quarterlyData;

  // Parse the quarterly rows - they are in fixed positions after the header
  // Row 2: April - June
  // Row 3: July - September
  // Row 4: October - December
  // Row 5: January - March
  // Row 6: Fiscal Year Total
  const quarterRowMappings = [
    { rowOffset: 1, key: 'aprilJune' },
    { rowOffset: 2, key: 'julySeptember' },
    { rowOffset: 3, key: 'octoberDecember' },
    { rowOffset: 4, key: 'januaryMarch' },
    { rowOffset: 5, key: 'fiscalYearTotal' },
  ];

  fiscalYears.forEach(({ fiscalYear, column }) => {
    const fiscalData = { fiscal: fiscalYear };

    quarterRowMappings.forEach(({ rowOffset, key }) => {
      const currentRowIndex = headerRowIndex + rowOffset;
      if (progressReportSheet[currentRowIndex]) {
        const value = progressReportSheet[currentRowIndex][column];
        if (value !== undefined && value !== null && value !== '') {
          fiscalData[key] = safeParseFloat(value);
        }
      }
    });

    // Only add fiscal data if it has at least one quarterly value
    const hasData = Object.keys(fiscalData).length > 1; // more than just 'fiscal'
    if (hasData) {
      quarterlyData.push(fiscalData);
    }
  });

  return quarterlyData;
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
  let eligibleCostsClaimed = null;
  let totalEligibleCostsClaimed = null;
  let isedShareFromClaimPayment = null;
  let bcShareFromClaimPayment = null;

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

      // Find which column contains the isEligibleCostsIncurredFromDateFlag
      let flagColumn = null;
      firstTenRowLetters.forEach((letter) => {
        if (
          claimsRequestFormSheet[i] &&
          claimsRequestFormSheet[i][letter] &&
          isEligibleCostsIncurredFromDateFlag(claimsRequestFormSheet[i][letter])
        ) {
          flagColumn = letter;
        }
      });

      // Helper function to get the next column (move one column to the right)
      const getNextColumn = (currentColumn: string): string | null => {
        const allColumns = [
          'A',
          'B',
          'C',
          'D',
          'E',
          'F',
          'G',
          'H',
          'I',
          'J',
          'K',
          'L',
          'M',
          'N',
          'O',
          'P',
        ];
        const currentIndex = allColumns.indexOf(currentColumn);
        if (currentIndex !== -1 && currentIndex < allColumns.length - 1) {
          return allColumns[currentIndex + 1];
        }
        return null;
      };

      // Parse the new fields based on their relative positions to isEligibleCostsIncurredFromDateFlag
      // Use the column one position to the right of the flag
      if (flagColumn) {
        const dataColumn = getNextColumn(flagColumn);
        if (dataColumn) {
          // eligibleCostsClaimed is 5 rows before
          if (i >= 5) {
            eligibleCostsClaimed = getEligibleCostsClaimed(
              claimsRequestFormSheet,
              i - 5,
              dataColumn
            );
          }

          // totalEligibleCostsClaimed is 4 rows before
          if (i >= 4) {
            totalEligibleCostsClaimed = getTotalEligibleCostsClaimed(
              claimsRequestFormSheet,
              i - 4,
              dataColumn
            );
          }

          // isedShareFromClaimPayment is 3 rows before
          if (i >= 3) {
            isedShareFromClaimPayment = getIsedShareFromClaimPayment(
              claimsRequestFormSheet,
              i - 3,
              dataColumn
            );
          }

          // bcShareFromClaimPayment is 2 rows before
          if (i >= 2) {
            bcShareFromClaimPayment = getBcShareFromClaimPayment(
              claimsRequestFormSheet,
              i - 2,
              dataColumn
            );
          }
        }
      }
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
  let communicationMaterials = null;
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
      communicationMaterials = getCommunicationMaterials(
        progressReportSheet,
        i
      );
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

  // Parse budget tables using known positions relative to "changes to overall budget"
  let projectBudgetByGovernmentFY = [];
  let updatedProvincialContributionByQuarter = [];
  let budgetTableRowIndex = -1;

  // Find the row where the "changes to overall budget" question was found
  for (let i = 0; i < progressReportSheet.length; i++) {
    if (
      checkFirstTenColumns(progressReportSheet, isChangesToOverallBudgetFlag, i)
    ) {
      budgetTableRowIndex = i + 1; // The table starts one row after the question
      break;
    }
  }

  if (budgetTableRowIndex !== -1) {
    // Parse the first budget table (By Government FY)
    // This table is exactly one row after the "changes to overall budget" question
    projectBudgetByGovernmentFY = parseProjectBudgetByGovernmentFY(
      progressReportSheet,
      budgetTableRowIndex
    );

    // Parse the second budget table (Provincial Contribution by Quarter)
    // This table header is 4 rows below the first table
    const quarterlyTableRowIndex = budgetTableRowIndex + 4;
    updatedProvincialContributionByQuarter =
      parseUpdatedProvincialContributionByQuarter(
        progressReportSheet,
        quarterlyTableRowIndex
      );
  }

  const jsonData = {
    dateRequestReceived,
    projectNumber,
    isedProjectNumber,
    claimNumber,
    eligibleCostsIncurredFromDate,
    eligibleCostsIncurredToDate,
    eligibleCostsClaimed,
    totalEligibleCostsClaimed,
    isedShareFromClaimPayment,
    bcShareFromClaimPayment,
    progressOnPermits,
    hasConstructionBegun,
    haveServicesBeenOffered,
    projectScheduleRisks,
    thirdPartyPassiveInfrastructure,
    communicationMaterials,
    projectBudgetRisks,
    changesToOverallBudget,
    projectBudgetByGovernmentFY,
    updatedProvincialContributionByQuarter,
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
        _oldId: Number.isNaN(data._oldId) ? null : data._oldId,
      },
    },
    req
  ).catch((e) => {
    return { error: e };
  });

  return result;
};

export default LoadClaimsData;
