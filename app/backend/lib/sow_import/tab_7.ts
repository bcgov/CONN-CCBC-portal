import * as XLSX from 'xlsx';
import { performQuery } from '../graphql';
import { convertExcelDropdownToBoolean } from './util';

const tab7Mutation = `
  mutation tab7Mutation($input: SowTab7Input!) {
    createSowTab7(input: { sowTab7: $input }) {
      sowTab7 {
        id
        jsonData
      }
    }
  }
`;

// ---------------------------------------------------------------------------
// Template version detection and column maps
//
// Old template (through 2026-27): fiscal-year columns G–J, total in K.
// Extended template (through 2028-29): fiscal-year columns G–L, total in M.
//
// All sections that break down funding or costs by fiscal year (Parts 2, 3
// and 4) use the same column layout, so a single map drives every read.
// ---------------------------------------------------------------------------

interface YearCols {
  2324: string;
  2425: string;
  2526: string;
  2627: string;
  2728: string | null;
  2829: string | null;
  total: string;
}

const OLD_YEAR_COLS: YearCols = {
  2324: 'G',
  2425: 'H',
  2526: 'I',
  2627: 'J',
  2728: null,
  2829: null,
  total: 'K',
};

const EXTENDED_YEAR_COLS: YearCols = {
  2324: 'G',
  2425: 'H',
  2526: 'I',
  2627: 'J',
  2728: 'K',
  2829: 'L',
  total: 'M',
};

// Scan the sheet for the Part 4 year-header row (where G='2023-24').
// Old template: K='Total'. Extended template: K='2027-28'.
const detectExtendedYears = (budget: any[]): boolean => {
  for (let row = 1000; row < budget.length; row++) {
    const rowData = budget[row];
    if (!rowData) continue;
    const gVal = rowData['G'];
    if (typeof gVal === 'string' && gVal.includes('2023-24')) {
      const kVal = rowData['K'];
      return typeof kVal === 'string' && kVal.includes('2027');
    }
  }
  return false;
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

// Build a fiscal-year object from one spreadsheet row using the active column
// map.  New-format years are only included when the map has a non-null column
// for them, keeping old-format objects compact.  Callers merge the result into
// the appropriate detailedBudget sub-object via Object.assign.
const readFiscalYearRow = (
  rowData: any,
  cols: YearCols
): Record<string | number, any> => {
  const result: Record<string | number, any> = {
    2324: rowData[cols[2324]],
    2425: rowData[cols[2425]],
    2526: rowData[cols[2526]],
    2627: rowData[cols[2627]],
    total: rowData[cols.total],
  };
  if (cols[2728]) result[2728] = rowData[cols[2728]];
  if (cols[2829]) result[2829] = rowData[cols[2829]];
  return result;
};

// Returns an initialised per-fiscal-year object that matches the template
// version in use. Only old-format objects when isExtended=false so that old
// uploads produce the same JSON shape as before.
const makeFiscalYears = (isExtended: boolean) =>
  isExtended
    ? { 2324: '', 2425: '', 2526: '', 2627: '', 2728: '', 2829: '', total: '' }
    : { 2324: '', 2425: '', 2526: '', 2627: '', total: '' };

// ---------------------------------------------------------------------------
// Main reader
// ---------------------------------------------------------------------------

const readBudget = async (sow_id, wb, sheet_name) => {
  const budget = XLSX.utils.sheet_to_json(wb.Sheets[sheet_name], {
    header: 'A',
  });

  const isExtended = detectExtendedYears(budget);
  const cols: YearCols = isExtended ? EXTENDED_YEAR_COLS : OLD_YEAR_COLS;
  // Keys that need a 0 fallback for the FNHA row when it is absent.
  const fiscalYearKeys: (number | string)[] = isExtended
    ? [2324, 2425, 2526, 2627, 2728, 2829, 'total']
    : [2324, 2425, 2526, 2627, 'total'];

  const fy = () => makeFiscalYears(isExtended);

  const getRowNumber = (rowData: any, fallbackIndex: number) => {
    if (rowData && typeof rowData.__rowNum__ === 'number') {
      return rowData.__rowNum__ + 1;
    }
    return fallbackIndex + 1;
  };

  const cellRefs: Record<string, string> = {};
  const cellValues: Record<string, unknown> = {};
  const detailedBudget = {
    summaryTable: {
      targetingVeryRemoteOrIndigenousOrSatelliteDependentCommunity: false,
      totalEligibleCosts: '',
      totalIneligibleCosts: '',
      totalProjectCost: '',
      amountRequestedFromFederalGovernment: '',
      totalApplicantContribution: '',
      fundingFromAllOtherSources: '',
      amountRequestedFromProvince: '',
      totalInfrastructureBankFunding: '',
      totalFNHAFunding: '',
      totalFundingRequestedCCBC: '',
    },
    detailedBudget: {
      federalSharingRatio: 0,
      provincialSharingRatio: 0,
    },
    summaryOfEstimatedProjectCosts: {
      estimatedProjectCosts: {
        eligibleRuralBroadband: '',
        eligibleVeryRemoteSatelliteIndigenousBroadband: '',
        eligibleMobile: '',
        totalEligibleCosts: '',
        totalIneligibleCosts: '',
        totalProjectCost: '',
      },
      totalCostsPerCostCategory: {
        directLabour: {
          cost: '',
          percentOfTotalEligibleCosts: '',
        },
        directEquipment: {
          cost: '',
          percentOfTotalEligibleCosts: '',
        },
        directMaterials: {
          cost: '',
          percentOfTotalEligibleCosts: '',
        },
        directSatellite: {
          cost: '',
          percentOfTotalEligibleCosts: '',
        },
        directTravel: {
          cost: '',
          percentOfTotalEligibleCosts: '',
        },
        directOther: {
          cost: '',
          percentOfTotalEligibleCosts: '',
        },
        totalEligible: {
          cost: '',
          percentOfTotalEligibleCosts: '',
        },
      },
      thirtyPercentOfTotalEligibleCosts: '',
      projectCosts: {
        totalEligibleCosts: fy(),
        totalIneligibleCosts: fy(),
        totalProjectCost: fy(),
      },
    },
    summaryOfEstimatedProjectFunding: {
      federalContribution: fy(),
      applicationContribution: fy(),
      provincialContribution: fy(),
      infrastructureBankFunding: fy(),
      fnhaFunding: fy(),
      otherFundingPartners: [],
      totalFinancialContribution: fy(),
    },
    currentFiscalProvincialContributionForecastByQuarter: {
      aprilToJune: fy(),
      julyToSeptember: fy(),
      octoberToDecember: fy(),
      januaryToMarch: fy(),
      fiscalYearTotal: fy(),
    },
  };

  // -- SUMMARY TABLE --
  // first pass - column C
  for (let row = 1; row < 50; row++) {
    const rowData = budget[row];
    const suspect = rowData['C'];
    let value;
    if (suspect === undefined) continue;
    if (typeof suspect !== 'string') {
      value = suspect.toString();
    } else {
      value = suspect;
    }

    const rowNumber = getRowNumber(rowData, row);
    const setCellMetadata = (key: string, column: string) => {
      cellRefs[key] = `${column}${rowNumber}`;
      cellValues[key] = rowData[column];
    };

    if (value.indexOf('Are you targeting a very remote community') > -1) {
      detailedBudget.summaryTable.targetingVeryRemoteOrIndigenousOrSatelliteDependentCommunity =
        convertExcelDropdownToBoolean(budget[row]['D']);
      setCellMetadata(
        'targetingVeryRemoteOrIndigenousOrSatelliteDependentCommunity',
        'D'
      );
      break;
    }
  }

  // second pass - columns G - J
  for (let row = 1; row < 50; row++) {
    const rowData = budget[row];
    const suspect = rowData['G'];
    let value;
    if (suspect === undefined) continue;
    if (typeof suspect !== 'string') {
      value = suspect.toString();
    } else {
      value = suspect;
    }

    const rowNumber = getRowNumber(rowData, row);
    const setCellMetadata = (key: string, column: string) => {
      cellRefs[key] = `${column}${rowNumber}`;
      cellValues[key] = rowData[column];
    };

    if (value.indexOf('*Total Eligible Costs') > -1) {
      detailedBudget.summaryTable.totalEligibleCosts = rowData['H'];
      setCellMetadata('totalEligibleCosts', 'H');
    }
    if (value.indexOf('*Total Ineligible Costs') > -1) {
      detailedBudget.summaryTable.totalIneligibleCosts = rowData['H'];
      setCellMetadata('totalIneligibleCosts', 'H');
    }
    if (value.indexOf('*Total Project Cost') > -1) {
      detailedBudget.summaryTable.totalProjectCost = rowData['H'];
      setCellMetadata('totalProjectCost', 'H');
    }
    if (value.indexOf('*Amount requested from the Federal Government') > -1) {
      detailedBudget.summaryTable.amountRequestedFromFederalGovernment =
        rowData['H'];
      setCellMetadata('amountRequestedFromFederalGovernment', 'H');
      detailedBudget.summaryTable.amountRequestedFromProvince = rowData['J'];
      setCellMetadata('amountRequestedFromProvince', 'J');
    }
    if (value.indexOf('*Amount Applicant will contribute') > -1) {
      detailedBudget.summaryTable.totalApplicantContribution = rowData['H'];
      setCellMetadata('totalApplicantContribution', 'H');
      detailedBudget.summaryTable.totalInfrastructureBankFunding = rowData['J'];
      setCellMetadata('totalInfrastructureBankFunding', 'J');
    }
    if (value.indexOf('*Funding from all other sources') > -1) {
      detailedBudget.summaryTable.fundingFromAllOtherSources = rowData['H'];
      setCellMetadata('fundingFromAllOtherSources', 'H');
      detailedBudget.summaryTable.totalFundingRequestedCCBC = rowData['J'];
      setCellMetadata('totalFundingRequestedCCBC', 'J');
    }
  }
  // -- END SUMMARY TABLE --

  // -- DETAILED BUDGET --

  for (let row = 1000; row < 1050; row++) {
    const suspect = budget[row]['B'];
    let value;
    if (suspect === undefined) continue;
    if (typeof suspect !== 'string') {
      value = suspect.toString();
    } else {
      value = suspect;
    }
    if (value.indexOf('INDICATE FEDERAL SHARING RATIO') > -1) {
      detailedBudget.detailedBudget.federalSharingRatio = budget[row]['K'];
    }

    if (value.indexOf('INDICATE PROVINCIAL SHARING RATIO') > -1) {
      detailedBudget.detailedBudget.provincialSharingRatio = budget[row]['K'];
    }
  }

  // -- END DETAIlED BUDGET --

  // -- SUMMARY OF ESTIMATED PROJECT COSTS --

  // first pass - column B
  for (let row = 1000; row < 1076; row++) {
    const suspect = budget[row]['B'];
    let value;
    if (suspect === undefined) continue;
    if (typeof suspect !== 'string') {
      value = suspect.toString();
    } else {
      value = suspect;
    }

    // estimated project costs
    if (value.indexOf('Eligible - Rural Broadband') > -1) {
      detailedBudget.summaryOfEstimatedProjectCosts.estimatedProjectCosts.eligibleRuralBroadband =
        budget[row]['D'];
    }
    if (
      value.indexOf(
        'Eligible - Very Remote / Satellite / Indigenous Broadband'
      ) > -1
    ) {
      detailedBudget.summaryOfEstimatedProjectCosts.estimatedProjectCosts.eligibleVeryRemoteSatelliteIndigenousBroadband =
        budget[row]['D'];
    }
    if (value.indexOf('Eligible - Mobile') > -1) {
      detailedBudget.summaryOfEstimatedProjectCosts.estimatedProjectCosts.eligibleMobile =
        budget[row]['D'];
    }
    if (value.indexOf('Total Eligible Costs:') > -1) {
      detailedBudget.summaryOfEstimatedProjectCosts.estimatedProjectCosts.totalEligibleCosts =
        budget[row]['D'];
    }
    if (value.indexOf('Total Ineligible Costs:') > -1) {
      detailedBudget.summaryOfEstimatedProjectCosts.estimatedProjectCosts.totalIneligibleCosts =
        budget[row]['D'];
    }
    if (value.indexOf('Total Project Costs:') > -1) {
      detailedBudget.summaryOfEstimatedProjectCosts.estimatedProjectCosts.totalProjectCost =
        budget[row]['D'];
    }
  }

  // second pass - columns F - J, total costs per cost category and 30% of total eligible costs
  for (let row = 1000; row < 1077; row++) {
    const suspect = budget[row]['F'];
    let value;
    if (suspect === undefined) continue;
    if (typeof suspect !== 'string') {
      value = suspect.toString();
    } else {
      value = suspect;
    }

    if (value.indexOf('Direct Labour') > -1) {
      detailedBudget.summaryOfEstimatedProjectCosts.totalCostsPerCostCategory.directLabour.cost =
        budget[row]['G'];
      detailedBudget.summaryOfEstimatedProjectCosts.totalCostsPerCostCategory.directLabour.percentOfTotalEligibleCosts =
        budget[row]['H'];
      detailedBudget.summaryOfEstimatedProjectCosts.thirtyPercentOfTotalEligibleCosts =
        budget[row]['J'];
    }
    if (value.indexOf('Direct Equipment') > -1) {
      detailedBudget.summaryOfEstimatedProjectCosts.totalCostsPerCostCategory.directEquipment.cost =
        budget[row]['G'];
      detailedBudget.summaryOfEstimatedProjectCosts.totalCostsPerCostCategory.directEquipment.percentOfTotalEligibleCosts =
        budget[row]['H'];
    }
    if (value.indexOf('Direct Materials') > -1) {
      detailedBudget.summaryOfEstimatedProjectCosts.totalCostsPerCostCategory.directMaterials.cost =
        budget[row]['G'];
      detailedBudget.summaryOfEstimatedProjectCosts.totalCostsPerCostCategory.directMaterials.percentOfTotalEligibleCosts =
        budget[row]['H'];
    }
    if (value.indexOf('Direct Satellite') > -1) {
      detailedBudget.summaryOfEstimatedProjectCosts.totalCostsPerCostCategory.directSatellite.cost =
        budget[row]['G'];
      detailedBudget.summaryOfEstimatedProjectCosts.totalCostsPerCostCategory.directSatellite.percentOfTotalEligibleCosts =
        budget[row]['H'];
    }
    if (value.indexOf('Direct Travel') > -1) {
      detailedBudget.summaryOfEstimatedProjectCosts.totalCostsPerCostCategory.directTravel.cost =
        budget[row]['G'];
      detailedBudget.summaryOfEstimatedProjectCosts.totalCostsPerCostCategory.directTravel.percentOfTotalEligibleCosts =
        budget[row]['H'];
    }
    if (value.indexOf('Other Direct') > -1) {
      detailedBudget.summaryOfEstimatedProjectCosts.totalCostsPerCostCategory.directOther.cost =
        budget[row]['G'];
      detailedBudget.summaryOfEstimatedProjectCosts.totalCostsPerCostCategory.directOther.percentOfTotalEligibleCosts =
        budget[row]['H'];
    }
    if (value.indexOf('Total Eligible Costs:') > -1) {
      detailedBudget.summaryOfEstimatedProjectCosts.totalCostsPerCostCategory.totalEligible.cost =
        budget[row]['G'];
      detailedBudget.summaryOfEstimatedProjectCosts.totalCostsPerCostCategory.totalEligible.percentOfTotalEligibleCosts =
        budget[row]['H'];
    }
  }

  // last pass - column B, per-fiscal-year project cost breakdown
  for (let row = 1076; row < 1090; row++) {
    const suspect = budget[row]['B'];
    let value;
    if (suspect === undefined) continue;
    if (typeof suspect !== 'string') {
      value = suspect.toString();
    } else {
      value = suspect;
    }

    if (value.indexOf('Total Eligible Costs') > -1) {
      Object.assign(
        detailedBudget.summaryOfEstimatedProjectCosts.projectCosts
          .totalEligibleCosts,
        readFiscalYearRow(budget[row], cols)
      );
    }
    if (value.indexOf('Total Ineligible Costs') > -1) {
      Object.assign(
        detailedBudget.summaryOfEstimatedProjectCosts.projectCosts
          .totalIneligibleCosts,
        readFiscalYearRow(budget[row], cols)
      );
    }
    if (value.indexOf('Total Project Costs') > -1) {
      Object.assign(
        detailedBudget.summaryOfEstimatedProjectCosts.projectCosts
          .totalProjectCost,
        readFiscalYearRow(budget[row], cols)
      );
    }
  }

  // -- END SUMMARY OF ESTIMATED PROJECT COSTS --

  // -- SUMMARY OF ESTIMATED PROJECT FUNDING --

  // one pass only
  for (let row = 1079; row < 1095; row++) {
    const suspect = budget[row]['B'];
    let value;
    if (suspect === undefined) continue;
    if (typeof suspect !== 'string') {
      value = suspect.toString();
    } else {
      value = suspect;
    }

    // we are on Project funding
    if (value.indexOf('Project Funding') > -1) {
      // next 4 rows are the fixed funding sources
      row++;
      // Federal contribution
      Object.assign(
        detailedBudget.summaryOfEstimatedProjectFunding.federalContribution,
        readFiscalYearRow(budget[row], cols)
      );
      row++;
      // recipient/application contribution
      Object.assign(
        detailedBudget.summaryOfEstimatedProjectFunding.applicationContribution,
        readFiscalYearRow(budget[row], cols)
      );
      row++;
      // provincial contribution
      Object.assign(
        detailedBudget.summaryOfEstimatedProjectFunding.provincialContribution,
        readFiscalYearRow(budget[row], cols)
      );
      row++;
      // applicant contribution by CIB/Infrastructure banking
      Object.assign(
        detailedBudget.summaryOfEstimatedProjectFunding
          .infrastructureBankFunding,
        readFiscalYearRow(budget[row], cols)
      );
      row++;
      // next 7 are possible other
      let fnhaFundingRow = {};
      let fnhaFundingIndex = -1;
      for (let otherRow = row; otherRow < row + 7; otherRow++) {
        const otherSuspect = budget[otherRow]['B'];
        let otherValue;
        if (otherSuspect === undefined) continue;
        if (typeof otherSuspect !== 'string') {
          otherValue = otherSuspect.toString();
        } else {
          otherValue = otherSuspect;
        }
        // if we don't have the predefined phrase, we have a custom other
        if (
          otherValue.indexOf('Identify other source of funding by name') > -1
        ) {
          continue;
        } else if (
          otherValue.indexOf('First Nations Health Authority (FNHA)') > -1
        ) {
          fnhaFundingRow = budget[otherRow];
          fnhaFundingIndex = otherRow;
        } else {
          const partner: Record<string | number, any> = {
            fundingPartnersName: budget[otherRow]['B'],
            2324: budget[otherRow][cols[2324]],
            2425: budget[otherRow][cols[2425]],
            2526: budget[otherRow][cols[2526]],
            2627: budget[otherRow][cols[2627]],
            total: budget[otherRow][cols.total],
          };
          if (cols[2728]) partner[2728] = budget[otherRow][cols[2728]];
          if (cols[2829]) partner[2829] = budget[otherRow][cols[2829]];
          detailedBudget.summaryOfEstimatedProjectFunding.otherFundingPartners.push(
            partner
          );
        }
      }

      // FNHA Funding — apply ?? 0 fallback for missing/absent rows
      const fnhaValues = readFiscalYearRow(fnhaFundingRow, cols);
      fiscalYearKeys.forEach((key) => {
        if (fnhaValues[key] === undefined) fnhaValues[key] = 0;
      });
      Object.assign(
        detailedBudget.summaryOfEstimatedProjectFunding.fnhaFunding,
        fnhaValues
      );
      detailedBudget.summaryTable.totalFNHAFunding =
        detailedBudget.summaryOfEstimatedProjectFunding.fnhaFunding.total;
      const fnhaRowNumber = getRowNumber(
        budget[fnhaFundingIndex],
        fnhaFundingIndex
      );
      cellRefs.totalFNHAFunding = `${cols.total}${fnhaRowNumber}`;
      cellValues.totalFNHAFunding = fnhaFundingRow[cols.total];
    }
    // get totals
    if (value.indexOf('Total Financial Contributions') > -1) {
      Object.assign(
        detailedBudget.summaryOfEstimatedProjectFunding
          .totalFinancialContribution,
        readFiscalYearRow(budget[row], cols)
      );
    }
  }

  // -- END SUMMARY OF ESTIMATED PROJECT FUNDING --

  // -- CURRENT FISCAL PROVINCIAL CONTRIBUTION FORECAST BY QUARTER --

  // one pass only
  for (let row = 1080; row < budget.length; row++) {
    const suspect = budget[row]['B'];
    let value;
    if (suspect === undefined) continue;
    if (typeof suspect !== 'string') {
      value = suspect.toString();
    } else {
      value = suspect;
    }

    if (value.indexOf('April') > -1) {
      Object.assign(
        detailedBudget.currentFiscalProvincialContributionForecastByQuarter
          .aprilToJune,
        readFiscalYearRow(budget[row], cols)
      );
    }
    if (value.indexOf('July') > -1) {
      Object.assign(
        detailedBudget.currentFiscalProvincialContributionForecastByQuarter
          .julyToSeptember,
        readFiscalYearRow(budget[row], cols)
      );
    }
    if (value.indexOf('October') > -1) {
      Object.assign(
        detailedBudget.currentFiscalProvincialContributionForecastByQuarter
          .octoberToDecember,
        readFiscalYearRow(budget[row], cols)
      );
    }
    if (value.indexOf('January') > -1) {
      Object.assign(
        detailedBudget.currentFiscalProvincialContributionForecastByQuarter
          .januaryToMarch,
        readFiscalYearRow(budget[row], cols)
      );
    }
    if (value.indexOf('Fiscal Year Total') > -1) {
      Object.assign(
        detailedBudget.currentFiscalProvincialContributionForecastByQuarter
          .fiscalYearTotal,
        readFiscalYearRow(budget[row], cols)
      );
    }
  }

  // -- END CURRENT FISCAL PROVINCIAL CONTRIBUTION FORECAST BY QUARTER --
  return { ...detailedBudget, cellRefs, cellValues };
};

// ---------------------------------------------------------------------------
// Validation — same rules apply to both template versions; the summary table
// values being checked are all single-cell totals unaffected by format.
// ---------------------------------------------------------------------------

const ValidateData = (
  data,
  cellRefs: Record<string, string> = {},
  cellValues: Record<string, unknown> = {}
) => {
  const errors = [];

  const addError = (key: string, error: string, expected?: string) => {
    errors.push({
      level: 'cell',
      cell: cellRefs[key],
      error,
      received: cellValues[key] ?? data[key] ?? 'null',
      expected: expected || 'number',
    });
  };

  if (typeof data.totalEligibleCosts !== 'number') {
    addError('totalEligibleCosts', 'Invalid data: Total Eligible Costs');
  }
  if (typeof data.totalIneligibleCosts !== 'number') {
    addError('totalIneligibleCosts', 'Invalid data: Total Ineligible Costs');
  }
  if (typeof data.totalProjectCost !== 'number') {
    addError('totalProjectCost', 'Invalid data: Total Project Costs');
  }
  if (typeof data.amountRequestedFromFederalGovernment !== 'number') {
    addError(
      'amountRequestedFromFederalGovernment',
      'Invalid data: Amount Requested from the Federal Government'
    );
  }
  if (typeof data.amountRequestedFromProvince !== 'number') {
    addError(
      'amountRequestedFromProvince',
      'Invalid data: Amount Requested from the Province',
      'number'
    );
  }
  if (typeof data.totalApplicantContribution !== 'number') {
    addError(
      'totalApplicantContribution',
      'Invalid data: Amount Applicant will contribute'
    );
  }
  if (typeof data.totalInfrastructureBankFunding !== 'number') {
    addError(
      'totalInfrastructureBankFunding',
      'Invalid data: Amount CIB will contribute'
    );
  }
  if (typeof data.totalFNHAFunding !== 'number') {
    addError(
      'totalFNHAFunding',
      'Invalid data: First Nations Health Authority (FNHA)'
    );
  }
  if (typeof data.fundingFromAllOtherSources !== 'number') {
    addError(
      'fundingFromAllOtherSources',
      'Invalid data: Funding from all other sources'
    );
  }
  if (typeof data.totalFundingRequestedCCBC !== 'number') {
    addError(
      'totalFundingRequestedCCBC',
      'Invalid data: Total Requested from the CCBC Program'
    );
  }

  if (
    data.targetingVeryRemoteOrIndigenousOrSatelliteDependentCommunity ===
    undefined
  ) {
    addError(
      'targetingVeryRemoteOrIndigenousOrSatelliteDependentCommunity',
      'Invalid data: Targeting very remote community',
      'Yes/No value'
    );
  }
  return errors;
};

const LoadTab7Data = async (sow_id, wb, sheet_name, req) => {
  const validate = req.query?.validate === 'true';
  const rawData = await readBudget(sow_id, wb, sheet_name);
  const { cellRefs = {}, cellValues = {}, ...data } = rawData;

  const errorList = ValidateData(data.summaryTable, cellRefs, cellValues);

  if (errorList.length > 0) {
    return { error: errorList };
  }

  if (validate) {
    return data;
  }

  const input = { input: { sowId: parseInt(sow_id, 10), jsonData: data } };
  // time to persist in DB
  const result = await performQuery(tab7Mutation, input, req).catch((e) => {
    return { error: [{ level: 'database', error: e }] };
  });
  return result;
};

export default LoadTab7Data;
