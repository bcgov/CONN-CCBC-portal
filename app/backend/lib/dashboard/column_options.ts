import { Columns } from 'write-excel-file';

const columnOptions: Columns = [
  // column 1 (program)
  {},
  // column 2 (project id)
  { width: 12 },
  // column 3 (phase)
  {},
  // column 4 (zone)
  {},
  // column 5 (intake number)
  {},
  // column 6 (internal status)
  { width: 20 },
  // column 7 (external status)
  { width: 20 },
  // column 8 (change request pending)
  {},
  // column 9 (title)
  { width: 20 },
  // column 10 (project description)
  {},
  // column 11 (current operating name)
  {},
  // column 12 (830 million funding)
  {},
  // column 13 (Federal Funding Source)
  { width: 20 },
  // column 14 (Federal Project Number)
  {},
  // column 15 (Project type)
  {},
  // column 16 (transport project type)
  {},
  // column 17 (highway project type)
  {},
  // column 18 (last mile technology)
  {},
  // column 19 (last mile minimum speed)
  {},
  // column 20 (Connected Coast Network Dependent)
  {},
  // column 21 (Project location)
  {},
  // column 22 (Economic Region)
  {},
  // column 23 (Regional District)
  {},
  // column 24 (Geographic Names)
  {},
  // column 25 geo ids
  {},
  // column 26 (Total communities and locales)
  {},
  // column 27 (Indigenous communities)
  {},
  // column 28 (Household count)
  {},
  // column 29 (Transport KM)
  {},
  // column 30 (Highway KM)
  {},
  // column 31 (Rest Areas)
  {},
  // column 32 (bc funding)
  { width: 24 },
  // column 33 (applicant amount)
  { width: 24 },
  // column 34 (other funds requested)
  { width: 24 },
  // column 35 (total fnha funding)
  { width: 24 },
  // column 36 (total budget)
  { width: 24 },
  // column 37 (announced by bc/ised)
  {},
  // column 38 (Date application received)
  {},
  // column 39 (Date conditionally approved)
  {},
  // column 40 (date agreement signed)
  {},
  // column 41 (Proposed start date)
  {},
  // column 42 (Proposed completion date)
  // TODO: review all comments in this list to be consistent
  // with columnList and columnMap
  {},
  // column 43 (% Project milestone completion)
  {},
  // column 44 (Construction completed on)
  {},
];

export default columnOptions;
