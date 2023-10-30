import { convertExcelDateToJSDate } from '../sow_import/util';

const columnMap = {
  'Project #': 'A',
  'Original Project #': 'B',
  Phase: 'C',
  Intake: 'D',
  'Project Status': 'E',
  'Change Request Pending': 'F',
  'Project Title': 'G',
  'Project Description': 'H',
  "Applicant's Contractual Name": 'I',
  'Current Operating Name': 'J',
  '$830 million funding': 'K',
  'Federal Funding Source': 'L',
  'Federal Project #': 'M',
  'Project Type': 'N',
  'Transport Project Type': 'O',
  'Highway Project Type': 'P',
  'Last-Mile Project Type': 'Q',
  'Last-Mile Minimum Speed': 'R',
  'Connected Coast Network Dependent': 'S',
  'Project Locations': 'T',
  'Communities and Locales Total Count': 'U',
  'Indigenous Communities': 'V',
  'Household Count': 'W',
  'Transport km': 'X',
  'Highway km': 'Y',
  'Rest Areas': 'Z',
  'BC Funding Request': 'AA',
  'Federal Funding': 'AB',
  'Applicant Amount': 'AC',
  'Other Funding': 'AD',
  'Total Project Budget': 'AE',
  'NDIT Conditional Approval Letter Send to Applicant': 'AF',
  'Binding Agreement Signed btw NDIT and Recipient': 'AG',
  'Announced by Province': 'AH',
  'Date Application Received': 'AI',
  'Date Conditionally Approved': 'AJ',
  'Date Agreement Signed': 'AK',
  'Proposed Start Date': 'AL',
  'Proposed Completion Date': 'AM',
  'Reporting Completion Date': 'AN',
  'Date Announced': 'AO',
  '% Project Milestone Complete': 'AP',
  'Construction Completed On': 'AQ',
  'Milestone Comments': 'AR',
  'Primary News Release': 'AS',
  'Secondary News Release': 'AT',
  Notes: 'AU',
  Locked: 'AV',
  'Last Reviewed': 'AW',
  'Review Notes': 'AX',
};

const validateColumns = (columnList) => {
  const errors = [];
  Object.entries(columnMap).forEach(([key, value]) => {
    if (columnList[value] !== key) {
      errors.push(
        `Column heading "${columnList[value]}" in column ${value} does not match expected name: "${key}"`
      );
    }
  });

  return errors;
};

const validateNumber = (value, fieldName, errorList, projectNumber) => {
  if (!value) {
    return null;
  }
  if (typeof value === 'number') {
    return value;
  }

  errorList.push(
    `Project #${projectNumber}: ${fieldName} not imported due to formatting error - value should be a number`
  );
  return null;
};

const validateDate = (value, fieldName, errorList, projectNumber) => {
  if (!value) {
    return null;
  }
  if (typeof value === 'number' || typeof value === 'string') {
    // work around for 'NULL' value
    const result = convertExcelDateToJSDate(value);
    if (result) {
      return result;
    }
  }

  errorList.push(
    `Project #${projectNumber}: ${fieldName} not imported due to formatting error - value should be a date`
  );
  return null;
};

export { validateDate, validateColumns, validateNumber };
