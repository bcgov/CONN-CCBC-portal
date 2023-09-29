import XLSX, { WorkBook } from 'xlsx';

const TOTAL_ELIGIBLE_COSTS_ROW = 24;
const DATA_COLUMN = 'H';
const TOTAL_PROJECT_COSTS_ROW = 25;

const readTemplateTwoData = (wb: WorkBook, sheetName = 'Template 2') => {
  const sheet = XLSX.utils.sheet_to_json(wb.Sheets[sheetName], {
    header: 'A',
  });

  const totalEligibleCosts = sheet[TOTAL_ELIGIBLE_COSTS_ROW][DATA_COLUMN];
  const totalProjectCosts = sheet[TOTAL_PROJECT_COSTS_ROW][DATA_COLUMN];

  return {
    totalEligibleCosts,
    totalProjectCosts,
  };
};

export default readTemplateTwoData;
