import XLSX, { WorkBook } from 'xlsx';

const FINAL_ELIGIBLE_HOUSEHOLDS_COLUMN = 'F';
const FINAL_ELIGIBLE_HOUSEHOLDS_COLUMN_TITLE =
  'Final number of Eligible Households targeted by this proposal';
const TITLE_COLUMN = 'C';
const TOTAL_INDIGENOUS_HOUSEHOLDS_COLUMN = 'G';
const TOTAL_INDIGENOUS_HOUSEHOLDS_COLUMN_TITLE =
  'Number of impacted households on indigenous lands';

const readTemplateOneData = (
  wb: WorkBook,
  sheetName = 'Eligibility_Summary'
) => {
  const sheet = XLSX.utils.sheet_to_json(wb.Sheets[sheetName], {
    header: 'A',
  });

  let finalEligibleHouseholdsRow = 0;

  let totalIndigenousHouseholdsRow = 0;

  for (let i = 0; i < sheet.length; i += 1) {
    if (
      typeof sheet[i][TITLE_COLUMN] === 'string' &&
      sheet[i][TITLE_COLUMN].toLowerCase() ===
        FINAL_ELIGIBLE_HOUSEHOLDS_COLUMN_TITLE.toLowerCase()
    ) {
      finalEligibleHouseholdsRow = i;
    }
    if (
      typeof sheet[i][TITLE_COLUMN] === 'string' &&
      sheet[i][TITLE_COLUMN].toLowerCase() ===
        TOTAL_INDIGENOUS_HOUSEHOLDS_COLUMN_TITLE.toLowerCase()
    ) {
      totalIndigenousHouseholdsRow = i;
    }
  }

  if (finalEligibleHouseholdsRow === 0 || totalIndigenousHouseholdsRow === 0) {
    return null;
  }

  const finalEligibleHouseholds =
    sheet[finalEligibleHouseholdsRow][FINAL_ELIGIBLE_HOUSEHOLDS_COLUMN];
  const totalNumberHouseholdsImpacted =
    sheet[totalIndigenousHouseholdsRow][TOTAL_INDIGENOUS_HOUSEHOLDS_COLUMN];

  return {
    finalEligibleHouseholds,
    totalNumberHouseholdsImpacted,
  };
};

export default readTemplateOneData;
