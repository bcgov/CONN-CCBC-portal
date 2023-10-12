import XLSX, { WorkBook } from 'xlsx';

const TOTAL_ELIGIBLE_COSTS_TITLE = '*Total Eligible Costs';
const TOTAL_PROJECT_COST_TITLE = '*Total Project Cost';
const DATA_COLUMN = 'H';
const TITLE_COLUMN = 'G';
const readTemplateTwoData = (wb: WorkBook, sheetName = 'Template 2') => {
  const sheet = XLSX.utils.sheet_to_json(wb.Sheets[sheetName], {
    header: 'A',
  });

  let totalEligibleCostsRow = 0;
  let totalProjectCostRow = 0;

  for (let i = 0; i < sheet.length; i += 1) {
    if (sheet[i][TITLE_COLUMN] === TOTAL_ELIGIBLE_COSTS_TITLE) {
      totalEligibleCostsRow = i;
    }
    if (sheet[i][TITLE_COLUMN] === TOTAL_PROJECT_COST_TITLE) {
      totalProjectCostRow = i;
    }
  }

  if (totalProjectCostRow === 0 || totalEligibleCostsRow === 0) {
    return null;
  }

  const totalEligibleCosts = sheet[totalEligibleCostsRow][DATA_COLUMN];
  const totalProjectCosts = sheet[totalProjectCostRow][DATA_COLUMN];

  return {
    totalEligibleCosts,
    totalProjectCosts,
  };
};

export default readTemplateTwoData;
