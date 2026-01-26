import { Columns } from 'write-excel-file';

const columnOptions: Columns = [
  // column 1
  { width: 12 },
  // column 2
  { width: 12 },
  // column 3
  { width: 9 },
  // column 4
  { width: 9 },
  // column 5
  { width: 8 },
  // column 6 (project #)
  { width: 14 },
  // column 7 ( federal project #)
  { width: 18 },
  // column 8 (applicant)
  { width: 18 },
  // column 9 (project title)
  { width: 18 },
  // column 10 (economic region)
  { width: 18 },
  // column 11 (BC/ISED Funded)
  { width: 18 },
  // column 12 ($830M Funding)
  { width: 15 },
  // column 13 (federal funding source)
  { width: 18 },
  // column 14 (status)
  { width: 20 },
  // column 15 (project milestone complete)
  {},
  // column 16 (project milestone completion date)
  {},
  // column 17 (project description)
  {},
  // column 18
  {},
  // column 19
  {},
  // column 20 (project type)
  { width: 20 },
  // column 21 (bc funding requested)
  { width: 20 },
  // column 22 (federal funding requested)
  { width: 20 },
  // column 23 (FNHA funding)
  { width: 20 },
  // column 24 (Applicant amount)
  { width: 20 },
  // column 25 (other funding requested)
  { width: 20 },
  // column 26 (total project budget)
  { width: 20 },
  // column 27
  {},
  // column 28
  {},
  // column 29
  {},
  // column 30
  {},
  // column 31
  {},
  // column 32
  {},
  // column 33
  {},
  // column 34
  {},
  // column 35
  {},
  // column 36
  {},
  // column 37
  {},
  // column 38
  {},
  // column 39 (Notes)
  { width: 20 },
  // column 40
  {},
];

const columnOptionsWithChangeLog: Columns = [
  ...columnOptions,
  // column 41 (change log)
  { width: 40 },
];

export { columnOptionsWithChangeLog };
export default columnOptions;
