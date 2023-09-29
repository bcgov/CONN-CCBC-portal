import XLSX, { WorkBook } from 'xlsx';

const FINAL_ELIGIBLE_HOUSEHOLDS_COLUMN = 'F';
const FINAL_ELIGIBLE_HOUSEHOLDS_ROW = 90;
const TOTAL_INDIGENOUS_HOUSEHOLDS_COLUMN = 'G';
const TOTAL_INDIGENOUS_HOUSEHOLDS_ROW = 39;

const readTemplateOneData = (
  wb: WorkBook,
  sheetName = 'Eligibility_Summary'
) => {
  const sheet = XLSX.utils.sheet_to_json(wb.Sheets[sheetName], {
    header: 'A',
  });

  const finalEligibleHouseholds =
    sheet[FINAL_ELIGIBLE_HOUSEHOLDS_ROW][FINAL_ELIGIBLE_HOUSEHOLDS_COLUMN];
  const totalNumberHouseholdsImpacted =
    sheet[TOTAL_INDIGENOUS_HOUSEHOLDS_ROW][TOTAL_INDIGENOUS_HOUSEHOLDS_COLUMN];

  return {
    finalEligibleHouseholds,
    totalNumberHouseholdsImpacted,
  };
};

export default readTemplateOneData;
