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

const readBudget = async (sow_id, wb, sheet_name) => {
  const budget = XLSX.utils.sheet_to_json(wb.Sheets[sheet_name], {
    header: 'A',
  });

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
        totalEligibleCosts: {
          2324: '',
          2425: '',
          2526: '',
          2627: '',
          total: '',
        },
        totalIneligibleCosts: {
          2324: '',
          2425: '',
          2526: '',
          2627: '',
          total: '',
        },
        totalProjectCost: {
          2324: '',
          2425: '',
          2526: '',
          2627: '',
          total: '',
        },
      },
    },
    summaryOfEstimatedProjectFunding: {
      federalContribution: {
        2324: '',
        2425: '',
        2526: '',
        2627: '',
        total: '',
      },
      applicationContribution: {
        2324: '',
        2425: '',
        2526: '',
        2627: '',
        total: '',
      },
      provincialContribution: {
        2324: '',
        2425: '',
        2526: '',
        2627: '',
        total: '',
      },
      infrastructureBankFunding: {
        2324: '',
        2425: '',
        2526: '',
        2627: '',
        total: '',
      },
      fnhaFunding: {
        2324: '',
        2425: '',
        2526: '',
        2627: '',
        total: '',
      },
      otherFundingPartners: [],
      totalFinancialContribution: {
        2324: '',
        2425: '',
        2526: '',
        2627: '',
        total: '',
      },
    },
    currentFiscalProvincialContributionForecastByQuarter: {
      aprilToJune: {
        2324: '',
        2425: '',
        2526: '',
        2627: '',
        total: '',
      },
      julyToSeptember: {
        2324: '',
        2425: '',
        2526: '',
        2627: '',
        total: '',
      },
      octoberToDecember: {
        2324: '',
        2425: '',
        2526: '',
        2627: '',
        total: '',
      },
      januaryToMarch: {
        2324: '',
        2425: '',
        2526: '',
        2627: '',
        total: '',
      },
      fiscalYearTotal: {
        2324: '',
        2425: '',
        2526: '',
        2627: '',
        total: '',
      },
    },
  };

  // -- SUMMARY TABLE --
  // first pass - column B
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
      cellValues[key] = value;
    };

    // if (typeof(value) !== 'string') continue;
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

  // last pass - column B project costs
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
      detailedBudget.summaryOfEstimatedProjectCosts.projectCosts.totalEligibleCosts[2324] =
        budget[row]['G'];
      detailedBudget.summaryOfEstimatedProjectCosts.projectCosts.totalEligibleCosts[2425] =
        budget[row]['H'];
      detailedBudget.summaryOfEstimatedProjectCosts.projectCosts.totalEligibleCosts[2526] =
        budget[row]['I'];
      detailedBudget.summaryOfEstimatedProjectCosts.projectCosts.totalEligibleCosts[2627] =
        budget[row]['J'];
      detailedBudget.summaryOfEstimatedProjectCosts.projectCosts.totalEligibleCosts.total =
        budget[row]['K'];
    }
    if (value.indexOf('Total Ineligible Costs') > -1) {
      detailedBudget.summaryOfEstimatedProjectCosts.projectCosts.totalIneligibleCosts[2324] =
        budget[row]['G'];
      detailedBudget.summaryOfEstimatedProjectCosts.projectCosts.totalIneligibleCosts[2425] =
        budget[row]['H'];
      detailedBudget.summaryOfEstimatedProjectCosts.projectCosts.totalIneligibleCosts[2526] =
        budget[row]['I'];
      detailedBudget.summaryOfEstimatedProjectCosts.projectCosts.totalIneligibleCosts[2627] =
        budget[row]['J'];
      detailedBudget.summaryOfEstimatedProjectCosts.projectCosts.totalIneligibleCosts.total =
        budget[row]['K'];
    }
    if (value.indexOf('Total Project Costs') > -1) {
      detailedBudget.summaryOfEstimatedProjectCosts.projectCosts.totalProjectCost[2324] =
        budget[row]['G'];
      detailedBudget.summaryOfEstimatedProjectCosts.projectCosts.totalProjectCost[2425] =
        budget[row]['H'];
      detailedBudget.summaryOfEstimatedProjectCosts.projectCosts.totalProjectCost[2526] =
        budget[row]['I'];
      detailedBudget.summaryOfEstimatedProjectCosts.projectCosts.totalProjectCost[2627] =
        budget[row]['J'];
      detailedBudget.summaryOfEstimatedProjectCosts.projectCosts.totalProjectCost.total =
        budget[row]['K'];
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
      // next 4 rows are present funding sources
      // Federal contribution
      row++;
      detailedBudget.summaryOfEstimatedProjectFunding.federalContribution[2324] =
        budget[row]['G'];
      detailedBudget.summaryOfEstimatedProjectFunding.federalContribution[2425] =
        budget[row]['H'];
      detailedBudget.summaryOfEstimatedProjectFunding.federalContribution[2526] =
        budget[row]['I'];
      detailedBudget.summaryOfEstimatedProjectFunding.federalContribution[2627] =
        budget[row]['J'];
      detailedBudget.summaryOfEstimatedProjectFunding.federalContribution.total =
        budget[row]['K'];
      row++;
      // recipient/application contribution
      detailedBudget.summaryOfEstimatedProjectFunding.applicationContribution[2324] =
        budget[row]['G'];
      detailedBudget.summaryOfEstimatedProjectFunding.applicationContribution[2425] =
        budget[row]['H'];
      detailedBudget.summaryOfEstimatedProjectFunding.applicationContribution[2526] =
        budget[row]['I'];
      detailedBudget.summaryOfEstimatedProjectFunding.applicationContribution[2627] =
        budget[row]['J'];
      detailedBudget.summaryOfEstimatedProjectFunding.applicationContribution.total =
        budget[row]['K'];
      row++;
      // provincial contribution
      detailedBudget.summaryOfEstimatedProjectFunding.provincialContribution[2324] =
        budget[row]['G'];
      detailedBudget.summaryOfEstimatedProjectFunding.provincialContribution[2425] =
        budget[row]['H'];
      detailedBudget.summaryOfEstimatedProjectFunding.provincialContribution[2526] =
        budget[row]['I'];
      detailedBudget.summaryOfEstimatedProjectFunding.provincialContribution[2627] =
        budget[row]['J'];
      detailedBudget.summaryOfEstimatedProjectFunding.provincialContribution.total =
        budget[row]['K'];
      row++;
      // applicant contribution by CIB/Infrastructure banking
      detailedBudget.summaryOfEstimatedProjectFunding.infrastructureBankFunding[2324] =
        budget[row]['G'];
      detailedBudget.summaryOfEstimatedProjectFunding.infrastructureBankFunding[2425] =
        budget[row]['H'];
      detailedBudget.summaryOfEstimatedProjectFunding.infrastructureBankFunding[2526] =
        budget[row]['I'];
      detailedBudget.summaryOfEstimatedProjectFunding.infrastructureBankFunding[2627] =
        budget[row]['J'];
      detailedBudget.summaryOfEstimatedProjectFunding.infrastructureBankFunding.total =
        budget[row]['K'];
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
          detailedBudget.summaryOfEstimatedProjectFunding.otherFundingPartners.push(
            {
              fundingPartnersName: budget[otherRow]['B'],
              2324: budget[otherRow]['G'],
              2425: budget[otherRow]['H'],
              2526: budget[otherRow]['I'],
              2627: budget[otherRow]['J'],
              total: budget[otherRow]['K'],
            }
          );
        }
      }

      // FNHA Funding
      detailedBudget.summaryOfEstimatedProjectFunding.fnhaFunding[2324] =
        fnhaFundingRow['G'] ?? 0;
      detailedBudget.summaryOfEstimatedProjectFunding.fnhaFunding[2425] =
        fnhaFundingRow['H'] ?? 0;
      detailedBudget.summaryOfEstimatedProjectFunding.fnhaFunding[2526] =
        fnhaFundingRow['I'] ?? 0;
      detailedBudget.summaryOfEstimatedProjectFunding.fnhaFunding[2627] =
        fnhaFundingRow['J'] ?? 0;
      detailedBudget.summaryOfEstimatedProjectFunding.fnhaFunding.total =
        fnhaFundingRow['K'] ?? 0;
      detailedBudget.summaryTable.totalFNHAFunding = fnhaFundingRow['K'] ?? 0;
      const fnhaRowNumber = getRowNumber(
        budget[fnhaFundingIndex],
        fnhaFundingIndex
      );
      cellRefs.totalFNHAFunding = `K${fnhaRowNumber}`;
      cellValues.totalFNHAFunding = fnhaFundingRow['K'];
    }
    // get totals
    if (value.indexOf('Total Financial Contributions') > -1) {
      detailedBudget.summaryOfEstimatedProjectFunding.totalFinancialContribution[2324] =
        budget[row]['G'];
      detailedBudget.summaryOfEstimatedProjectFunding.totalFinancialContribution[2425] =
        budget[row]['H'];
      detailedBudget.summaryOfEstimatedProjectFunding.totalFinancialContribution[2526] =
        budget[row]['I'];
      detailedBudget.summaryOfEstimatedProjectFunding.totalFinancialContribution[2627] =
        budget[row]['J'];
      detailedBudget.summaryOfEstimatedProjectFunding.totalFinancialContribution.total =
        budget[row]['K'];
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
      detailedBudget.currentFiscalProvincialContributionForecastByQuarter.aprilToJune[2324] =
        budget[row]['G'];
      detailedBudget.currentFiscalProvincialContributionForecastByQuarter.aprilToJune[2425] =
        budget[row]['H'];
      detailedBudget.currentFiscalProvincialContributionForecastByQuarter.aprilToJune[2526] =
        budget[row]['I'];
      detailedBudget.currentFiscalProvincialContributionForecastByQuarter.aprilToJune[2627] =
        budget[row]['J'];
      detailedBudget.currentFiscalProvincialContributionForecastByQuarter.aprilToJune.total =
        budget[row]['K'];
    }
    if (value.indexOf('July') > -1) {
      detailedBudget.currentFiscalProvincialContributionForecastByQuarter.julyToSeptember[2324] =
        budget[row]['G'];
      detailedBudget.currentFiscalProvincialContributionForecastByQuarter.julyToSeptember[2425] =
        budget[row]['H'];
      detailedBudget.currentFiscalProvincialContributionForecastByQuarter.julyToSeptember[2526] =
        budget[row]['I'];
      detailedBudget.currentFiscalProvincialContributionForecastByQuarter.julyToSeptember[2627] =
        budget[row]['J'];
      detailedBudget.currentFiscalProvincialContributionForecastByQuarter.julyToSeptember.total =
        budget[row]['K'];
    }
    if (value.indexOf('October') > -1) {
      detailedBudget.currentFiscalProvincialContributionForecastByQuarter.octoberToDecember[2324] =
        budget[row]['G'];
      detailedBudget.currentFiscalProvincialContributionForecastByQuarter.octoberToDecember[2425] =
        budget[row]['H'];
      detailedBudget.currentFiscalProvincialContributionForecastByQuarter.octoberToDecember[2526] =
        budget[row]['I'];
      detailedBudget.currentFiscalProvincialContributionForecastByQuarter.octoberToDecember[2627] =
        budget[row]['J'];
      detailedBudget.currentFiscalProvincialContributionForecastByQuarter.octoberToDecember.total =
        budget[row]['K'];
    }
    if (value.indexOf('January') > -1) {
      detailedBudget.currentFiscalProvincialContributionForecastByQuarter.januaryToMarch[2324] =
        budget[row]['G'];
      detailedBudget.currentFiscalProvincialContributionForecastByQuarter.januaryToMarch[2425] =
        budget[row]['H'];
      detailedBudget.currentFiscalProvincialContributionForecastByQuarter.januaryToMarch[2526] =
        budget[row]['I'];
      detailedBudget.currentFiscalProvincialContributionForecastByQuarter.januaryToMarch[2627] =
        budget[row]['J'];
      detailedBudget.currentFiscalProvincialContributionForecastByQuarter.januaryToMarch.total =
        budget[row]['K'];
    }
    if (value.indexOf('Fiscal Year Total') > -1) {
      detailedBudget.currentFiscalProvincialContributionForecastByQuarter.fiscalYearTotal[2324] =
        budget[row]['G'];
      detailedBudget.currentFiscalProvincialContributionForecastByQuarter.fiscalYearTotal[2425] =
        budget[row]['H'];
      detailedBudget.currentFiscalProvincialContributionForecastByQuarter.fiscalYearTotal[2526] =
        budget[row]['I'];
      detailedBudget.currentFiscalProvincialContributionForecastByQuarter.fiscalYearTotal[2627] =
        budget[row]['J'];
      detailedBudget.currentFiscalProvincialContributionForecastByQuarter.fiscalYearTotal.total =
        budget[row]['K'];
    }
  }

  // -- END CURRENT FISCAL PROVINCIAL CONTRIBUTION FORECAST BY QUARTER --
  return { ...detailedBudget, cellRefs, cellValues };
};

const ValidateData = (
  data,
  cellRefs: Record<string, string> = {},
  cellValues: Record<string, unknown> = {}
) => {
  const errors = [];

  const addError = (key: string, error: string, expected?: string) => {
    errors.push({
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
