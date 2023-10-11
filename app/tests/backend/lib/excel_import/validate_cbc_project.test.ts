import { validateColumns } from 'backend/lib/excel_import/validate_cbc_project';

const columnList = {
  A: 'Project #',
  B: 'Original Project #',
  C: 'Phase',
  D: 'Intake',
  E: 'Project Status',
  F: 'Project Title',
  G: 'Project Description',
  H: 'Applicant',
  I: '$830 million funding',
  J: 'Federal Funding Source',
  K: 'Federal Project #',
  L: 'Project Type',
  M: 'Transport Project Type',
  N: 'Highway Project Type',
  O: 'Last-Mile Project Type',
  P: 'Last-Mile Minimum Speed',
  Q: 'Connected Coast Network Dependent',
  R: 'Project Locations',
  S: 'Communities and Locales Total Count',
  T: 'Indigenous Communities',
  U: 'Household Count',
  V: 'Transport km',
  W: 'Highway km',
  X: 'Rest Areas',
  Y: 'BC Funding Request',
  Z: 'Federal Funding',
  AA: 'Applicant Amount',
  AB: 'Other Funding',
  AC: 'Total Project Budget',
  AD: 'NDIT Conditional Approval Letter Send to Applicant',
  AE: 'Binding Agreement Signed btw NDIT and Recipient',
  AF: 'Announced by Province',
  AG: 'Date Application Received',
  AH: 'Date Conditionally Approved',
  AI: 'Date Agreement Signed',
  AJ: 'Proposed Start Date',
  AK: 'Proposed Completion Date',
  AL: 'Reporting Completion Date',
  AM: 'Date Announced',
  AN: '% Project Milestone Complete',
  AO: 'Construction Completed On',
  AP: 'Milestone Comments',
  AQ: 'Primary News Release',
  AR: 'Secondary News Release',
  AS: 'Notes',
  AT: 'Locked',
  AU: 'Last Reviewed',
  AV: 'Review Notes',
};

const errorColumns = {
  ...columnList,
  A: 'wrong column name',
  B: 'wrong column name',
};

describe('The validateColumns function', () => {
  it('returns an empty array when the columns are correct', () => {
    expect(validateColumns(columnList)).toStrictEqual([]);
  });

  it('returns an array of errors when the columns are incorrect', () => {
    expect(validateColumns(errorColumns)).toStrictEqual([
      'Column heading "wrong column name" in column A does not match expected name: "Project #"',
      'Column heading "wrong column name" in column B does not match expected name: "Original Project #"',
    ]);
  });
});
