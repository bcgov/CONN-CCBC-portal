import { validateColumns } from 'backend/lib/excel_import/validate_cbc_project';

const columnList = {
  A: 'Project #',
  B: 'Original Project #',
  C: 'Phase',
  D: 'Intake',
  E: 'Project Status',
  F: 'Project Title',
  G: 'Project Description',
  H: "Applicant's Contractual Name",
  I: 'Current Operating Name',
  J: '$830 million funding',
  K: 'Federal Funding Source',
  L: 'Federal Project #',
  M: 'Project Type',
  N: 'Transport Project Type',
  O: 'Highway Project Type',
  P: 'Last-Mile Project Type',
  Q: 'Last-Mile Minimum Speed',
  R: 'Connected Coast Network Dependent',
  S: 'Project Locations',
  T: 'Communities and Locales Total Count',
  U: 'Indigenous Communities',
  V: 'Household Count',
  W: 'Transport km',
  X: 'Highway km',
  Y: 'Rest Areas',
  Z: 'BC Funding Request',
  AA: 'Federal Funding',
  AB: 'Applicant Amount',
  AC: 'Other Funding',
  AD: 'Total Project Budget',
  AE: 'NDIT Conditional Approval Letter Send to Applicant',
  AF: 'Binding Agreement Signed btw NDIT and Recipient',
  AG: 'Announced by Province',
  AH: 'Date Application Received',
  AI: 'Date Conditionally Approved',
  AJ: 'Date Agreement Signed',
  AK: 'Proposed Start Date',
  AL: 'Proposed Completion Date',
  AM: 'Reporting Completion Date',
  AN: 'Date Announced',
  AO: '% Project Milestone Complete',
  AP: 'Construction Completed On',
  AQ: 'Milestone Comments',
  AR: 'Primary News Release',
  AS: 'Secondary News Release',
  AT: 'Notes',
  AU: 'Locked',
  AV: 'Last Reviewed',
  AW: 'Review Notes',
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

// eslint-disable-next-line jest/no-export
export default columnList;
