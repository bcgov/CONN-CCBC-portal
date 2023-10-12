import XLSX, { WorkBook } from 'xlsx';

const FINAL_ELIGIBLE_HOUSEHOLDS_COLUMN = 'F';
const TITLE_COLUMN = 'C';
const TOTAL_INDIGENOUS_HOUSEHOLDS_COLUMN = 'G';

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
      sheet[i][TITLE_COLUMN] ===
      'Final number of Eligible Households targeted by this proposal'
    ) {
      finalEligibleHouseholdsRow = i;
    }
    if (
      sheet[i][TITLE_COLUMN] ===
      'Number of impacted households on indigenous lands'
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
