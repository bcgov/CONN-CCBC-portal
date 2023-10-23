import * as luxon from 'luxon';
import { convertExcelDateToJSDate } from '../sow_import/util';

const columnMap = {
  'Project #': 'A',
  'Original Project #': 'B',
  Phase: 'C',
  Intake: 'D',
  'Project Status': 'E',
  'Project Title': 'F',
  'Project Description': 'G',
  "Applicant's Contractual Name": 'H',
  'Current Operating Name': 'I',
  '$830 million funding': 'J',
  'Federal Funding Source': 'K',
  'Federal Project #': 'L',
  'Project Type': 'M',
  'Transport Project Type': 'N',
  'Highway Project Type': 'O',
  'Last-Mile Project Type': 'P',
  'Last-Mile Minimum Speed': 'Q',
  'Connected Coast Network Dependent': 'R',
  'Project Locations': 'S',
  'Communities and Locales Total Count': 'T',
  'Indigenous Communities': 'U',
  'Household Count': 'V',
  'Transport km': 'W',
  'Highway km': 'X',
  'Rest Areas': 'Y',
  'BC Funding Request': 'Z',
  'Federal Funding': 'AA',
  'Applicant Amount': 'AB',
  'Other Funding': 'AC',
  'Total Project Budget': 'AD',
  'NDIT Conditional Approval Letter Send to Applicant': 'AE',
  'Binding Agreement Signed btw NDIT and Recipient': 'AF',
  'Announced by Province': 'AG',
  'Date Application Received': 'AH',
  'Date Conditionally Approved': 'AI',
  'Date Agreement Signed': 'AJ',
  'Proposed Start Date': 'AK',
  'Proposed Completion Date': 'AL',
  'Reporting Completion Date': 'AM',
  'Date Announced': 'AN',
  '% Project Milestone Complete': 'AO',
  'Construction Completed On': 'AP',
  'Milestone Comments': 'AQ',
  'Primary News Release': 'AR',
  'Secondary News Release': 'AS',
  Notes: 'AT',
  Locked: 'AU',
  'Last Reviewed': 'AV',
  'Review Notes': 'AW',
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
  if (typeof value === 'number') {
    return convertExcelDateToJSDate(value);
  }
  if (typeof value === 'string') {
    return luxon.DateTime.fromSQL(value).toJSDate();
  }

  errorList.push(
    `Project #${projectNumber}: ${fieldName} not imported due to formatting error - value should be a date`
  );
  return null;
};

export { validateDate, validateColumns, validateNumber };
