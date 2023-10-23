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
  Applicant: 'H',
  '$830 million funding': 'I',
  'Federal Funding Source': 'J',
  'Federal Project #': 'K',
  'Project Type': 'L',
  'Transport Project Type': 'M',
  'Highway Project Type': 'N',
  'Last-Mile Project Type': 'O',
  'Last-Mile Minimum Speed': 'P',
  'Connected Coast Network Dependent': 'Q',
  'Project Locations': 'R',
  'Communities and Locales Total Count': 'S',
  'Indigenous Communities': 'T',
  'Household Count': 'U',
  'Transport km': 'V',
  'Highway km': 'W',
  'Rest Areas': 'X',
  'BC Funding Request': 'Y',
  'Federal Funding': 'Z',
  'Applicant Amount': 'AA',
  'Other Funding': 'AB',
  'Total Project Budget': 'AC',
  'NDIT Conditional Approval Letter Send to Applicant': 'AD',
  'Binding Agreement Signed btw NDIT and Recipient': 'AE',
  'Announced by Province': 'AF',
  'Date Application Received': 'AG',
  'Date Conditionally Approved': 'AH',
  'Date Agreement Signed': 'AI',
  'Proposed Start Date': 'AJ',
  'Proposed Completion Date': 'AK',
  'Reporting Completion Date': 'AL',
  'Date Announced': 'AM',
  '% Project Milestone Complete': 'AN',
  'Construction Completed On': 'AO',
  'Milestone Comments': 'AP',
  'Primary News Release': 'AQ',
  'Secondary News Release': 'AR',
  Notes: 'AS',
  Locked: 'AT',
  'Last Reviewed': 'AU',
  'Review Notes': 'AV',
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
