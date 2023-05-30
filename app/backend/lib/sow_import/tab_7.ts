import * as XLSX from 'xlsx';
import { performQuery } from '../graphql';

const tab7Mutation = `
  mutation tab7Mutation($input: SowTab7Input!) {
    createSowTab7(input: { sowTab7: $input }) {
      sowTab7 {
        id
      }
    }
  }
`;

const readBudget = async (sow_id, wb, sheet_name) => {
  const budget = XLSX.utils.sheet_to_json(wb.Sheets[sheet_name], {
    header: 'A',
  });

  const detailedBudget = {
    targetingVeryRemoteOrIndigenousOrSatelliteDependentCommunity: '',
    totalEligibleCosts: '',
    totalIneligibleCosts: '',
    totalProjectCosts: '',
    amountRequestedFromFederalGovernment: '',
    amountApplicantWillContribute: '',
    fundingFromAllOtherSources: '',
    amountRequestedFromProvince: '',
    amountCIBWillContribute: '',
    totalRequestedFromCCBCProgram: '',
  };

  // only need summary table between rows 33 and 44
  // first pass - column C and D
  for (let row = 1; row < 50; row++) {
    const suspect = budget[row]['C'];
    let value;
    if (suspect === undefined) continue;
    if (typeof suspect !== 'string') {
      value = suspect.toString();
    } else {
      value = suspect;
    }

    // if (typeof(value) !== 'string') continue;
    if (value.indexOf('Are you targeting a very remote community') > -1) {
      detailedBudget.targetingVeryRemoteOrIndigenousOrSatelliteDependentCommunity =
        budget[row]['D'];
      break;
    }
  }

  // second pass - columns G - J
  for (let row = 1; row < 50; row++) {
    const suspect = budget[row]['G'];
    let value;
    if (suspect === undefined) continue;
    if (typeof suspect !== 'string') {
      value = suspect.toString();
    } else {
      value = suspect;
    }
    // if (typeof(value) !== 'string') continue;
    if (value.indexOf('*Total Eligible Costs') > -1) {
      detailedBudget.totalEligibleCosts = budget[row]['H'];
    }
    if (value.indexOf('*Total Ineligible Costs') > -1) {
      detailedBudget.totalIneligibleCosts = budget[row]['H'];
    }
    if (value.indexOf('*Total Project Cost') > -1) {
      detailedBudget.totalProjectCosts = budget[row]['H'];
    }
    if (value.indexOf('*Amount requested from the Federal Government') > -1) {
      detailedBudget.amountRequestedFromFederalGovernment = budget[row]['H'];
      detailedBudget.amountRequestedFromProvince = budget[row]['J'];
    }
    if (value.indexOf('*Amount Applicant will contribute') > -1) {
      detailedBudget.amountApplicantWillContribute = budget[row]['H'];
      detailedBudget.amountCIBWillContribute = budget[row]['J'];
    }
    if (value.indexOf('*Funding from all other sources') > -1) {
      detailedBudget.fundingFromAllOtherSources = budget[row]['H'];
      detailedBudget.totalRequestedFromCCBCProgram = budget[row]['J'];
    }
  }
  return detailedBudget;
};

const LoadTab7Data = async (sow_id, wb, sheet_name, req) => {
  const data = await readBudget(sow_id, wb, sheet_name);
  const input = { input: { sowId: sow_id, jsonData: data } };
  // time to persist in DB
  const result = await performQuery(tab7Mutation, input, req).catch((e) => {
    return { error: e };
  });
  return result;
};

export default LoadTab7Data;
