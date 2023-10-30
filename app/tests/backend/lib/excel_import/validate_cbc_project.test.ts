import { validateColumns } from 'backend/lib/excel_import/validate_cbc_project';

const columnList = {
  A: 'Project #',
  B: 'Original Project #',
  C: 'Phase',
  D: 'Intake',
  E: 'Project Status',
  F: 'Change Request Pending',
  G: 'Project Title',
  H: 'Project Description',
  I: "Applicant's Contractual Name",
  J: 'Current Operating Name',
  K: '$830 million funding',
  L: 'Federal Funding Source',
  M: 'Federal Project #',
  N: 'Project Type',
  O: 'Transport Project Type',
  P: 'Highway Project Type',
  Q: 'Last-Mile Project Type',
  R: 'Last-Mile Minimum Speed',
  S: 'Connected Coast Network Dependent',
  T: 'Project Locations',
  U: 'Communities and Locales Total Count',
  V: 'Indigenous Communities',
  W: 'Household Count',
  X: 'Transport km',
  Y: 'Highway km',
  Z: 'Rest Areas',
  AA: 'BC Funding Request',
  AB: 'Federal Funding',
  AC: 'Applicant Amount',
  AD: 'Other Funding',
  AE: 'Total Project Budget',
  AF: 'NDIT Conditional Approval Letter Send to Applicant',
  AG: 'Binding Agreement Signed btw NDIT and Recipient',
  AH: 'Announced by Province',
  AI: 'Date Application Received',
  AJ: 'Date Conditionally Approved',
  AK: 'Date Agreement Signed',
  AL: 'Proposed Start Date',
  AM: 'Proposed Completion Date',
  AN: 'Reporting Completion Date',
  AO: 'Date Announced',
  AP: '% Project Milestone Complete',
  AQ: 'Construction Completed On',
  AR: 'Milestone Comments',
  AS: 'Primary News Release',
  AT: 'Secondary News Release',
  AU: 'Notes',
  AV: 'Locked',
  AW: 'Last Reviewed',
  AX: 'Review Notes',
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
