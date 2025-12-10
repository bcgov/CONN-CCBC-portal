/**
 * @jest-environment node
 */
import * as XLSX from 'xlsx';
import request from 'supertest';
import LoadSummaryData from '../../../backend/lib/sow_import/summary_tab';

jest.mock('../../../backend/lib/graphql');

const fakeSummary = [
  {
    B: 20230427,
  },
  {
    B: 'SOW TABLES SUMMARY',
    N: 'English',
  },
  {
    B: 'General Instructions',
    G: 'Language:',
    H: 'English',
    N: 'français',
  },
  {
    B: 'PLEASE NOTE:  DO NOT COPY AND PASTE VALUES INTO THE TABLE, AS THERE ARE SPECIAL FORMATTING AND DATA VALIDATION RULES ASSOCIATED WITH THE CELLS, WHICH CAN BE OVERWRITTEN AND CAUSE ERRORS TO THE FUNCTIONALITY OF THE TABLE.\n•  The SOW tables have been locked to ensure data integrity.  Please only fill in the required fields. \n•  Please ensure that all applicable worksheets of this workbook are complete before sending this file back to CCBC.\n•  It is important to fill out the worksheets in order according to their numbering and as applicable based upon the type of project.  \n•  There are 8 steps to the SOW Tables: \nStep (1): Communities\nStep (2): Project Sites\nStep (3): POP Sites\nStep (4): Equipment\nStep (5): Service Offerings\nStep (6): Dependencies\nStep (7): Budget\nStep (8): Geographic Names\n•  Since the sheets have built in relationships that auto-fill cells in other sheets, it is important to enter all the information in a sheet completely before moving until the next sheet.\n•  Only optional cells can be left blank.\n•  Once all worksheets have been completed appropriately, the Summary worksheet will show a green message stating that "The SOW tables are ready to be sent to the Connecting Communities BC Fund.", otherwise the worksheet will show a red message stating that "The SOW tables are not ready to be sent to the Connecting Communities BC Fund."\n•  Each table will have a Message Center to the right of the table indicating any errors on inputting data.  When the table is appropriately filled, the message will clear and be highlighted in green.',
  },
  {
    B: 'Do Not Fill-This section is auto-populated',
  },
  {
    F: 'Backbone Technologies:',
  },
  {
    C: 'Applicant Name:',
    D: 'Northern Telecom',
    F: 'Fibre:',
    G: 'Yes',
  },
  {
    C: 'Project Title:',
    D: 'ZONE 4 - FTTH',
    F: 'Microwave:',
    G: 'No',
  },
  {
    C: 'Province:',
    D: 'BC',
    F: 'Satellite:',
    G: 'No',
  },
  {
    C: 'Application Number:',
    D: 'CCBC-020118',
    F: 'Last Mile Technologies:',
  },
  {
    C: 'CMIS Number:',
    D: '',
    F: 'Fibre:',
    G: 'Yes',
  },
  {
    F: 'Cable:',
    G: 'No',
  },
  {
    C: 'Effective Start Date (yyyy-mm-dd):',
    D: 45087,
    F: 'DSL:',
    G: 'No',
  },
  {
    C: 'Project Start Date (yyyy-mm-dd):',
    D: 45135,
    F: 'Mobile Wireless:',
    G: 'No',
  },
  {
    C: 'Project Completion Date (yyyy-mm-dd):',
    D: 45961,
    F: 'Fixed Wireless:',
    G: 'No',
  },
  {
    F: 'Satellite:',
    G: 'No',
  },
  {
    F: 'Indigenous Mobile Wireless:',
  },
  {
    B: 'The SOW tables contains incomplete information and is not ready to be sent to the Connecting Communities BC Fund.',
  },
  {
    M: 'The SOW tables contains incomplete information and is not ready to be sent to the Connecting Communities BC Fund.',
  },
  {
    B: 'Template Status - Summary',
  },
  {
    B: 'Do Not Fill-This section is auto-populated',
    M: 'The SOW tables are complete and are ready to be sent to the Connecting Communities BC Fund.',
  },
  {
    B: 'Step',
    C: 'Section Title',
    E: 'Status',
  },
  {
    B: 'Step 1',
    C: 'Community Impacts',
    E: 'Complete',
  },
  {
    B: 'Step 2',
    C: 'Project Sites',
    E: 'Complete',
  },
  {
    B: 'Step 3',
    C: 'POP Sites',
    E: 'Incomplete',
  },
  {
    B: 'Step 4',
    C: 'Network and Radio Equipment',
    E: 'Incomplete',
  },
  {
    B: 'Step 5',
    C: 'Last Mile Internet Service Offerings',
    E: 'Incomplete',
  },
  {
    B: 'Step 6',
    C: 'Project Dependencies',
    E: 'Incomplete',
  },
  {
    B: 'Step 7',
    C: 'Detailed Budget',
    E: 'Complete',
  },
  {
    B: 'Step 8',
    C: 'Geographic Names',
    E: 'Complete',
  },
];

describe('sow_summary parsing tests', () => {
  beforeEach(() => {
    jest.spyOn(XLSX, 'read').mockReturnValue({
      Sheets: { Sheet1: {} },
      SheetNames: ['Summary_Sommaire'],
    });
  });

  it('successfully reads a worksheet', async () => {
    jest.spyOn(XLSX.utils, 'sheet_to_json').mockReturnValue(fakeSummary);

    const wb = XLSX.read(null);
    const req = { ...request };
    req.query = { validate: 'true' };
    req.params = {
      applicationId: 1,
      ccbcNumber: 'CCBC-020118',
      amendmentNumber: 0,
      validate: 'true',
    };

    const data = await LoadSummaryData(wb, 'Summary_Sommaire', req);
    const expected = {
      _applicationId: 1,
      _amendmentNumber: 0,
      _jsonData: {
        organizationName: 'Northern Telecom',
        projectTitle: 'ZONE 4 - FTTH',
        province: 'BC',
        ccbc_number: 'CCBC-020118',
        effectiveStartDate: '2023-06-10T00:00:00.000Z',
        projectStartDate: '2023-07-28T00:00:00.000Z',
        projectCompletionDate: '2025-10-31T00:00:00.000Z',
        backboneFibre: true,
        backboneMicrowave: false,
        backboneSatellite: false,
        lastMileFibre: true,
        lastMileCable: false,
        lastMileDSL: false,
        lastMileMobileWireless: false,
        lastMileFixedWireless: false,
        lastMileSatellite: false,
      },
    };
    expect(data).toEqual(expected);
  });

  it('return errors for invalid worksheet', async () => {
    const brokenSummary = { ...fakeSummary };
    // overwrite company info and backbone tecnology
    brokenSummary[6]['D'] = '';
    brokenSummary[6]['G'] = '';
    brokenSummary[7]['D'] = '';
    brokenSummary[7]['G'] = '';
    brokenSummary[8]['D'] = '';
    brokenSummary[8]['G'] = '';
    // overwrite last mile tecnology
    brokenSummary[10]['G'] = 'INVALID';
    brokenSummary[11]['G'] = 'INVALID';
    brokenSummary[12]['G'] = 'INVALID';
    brokenSummary[13]['G'] = 'INVALID';
    brokenSummary[14]['G'] = 'INVALID';
    brokenSummary[15]['G'] = 'INVALID';

    // overwrite dates
    brokenSummary[12]['D'] = '';
    brokenSummary[13]['D'] = '';
    brokenSummary[14]['D'] = '';

    jest.spyOn(XLSX.utils, 'sheet_to_json').mockReturnValue(brokenSummary);

    const wb = XLSX.read(null);
    const req = { ...request };
    req.query = { validate: true };
    req.params = { applicationId: 1, ccbcNumber: 'CCBC-020118' };

    const data = await LoadSummaryData(wb, 'Summary_Sommaire', req);
    const expected = {
      error: [
        {
          level: 'cell',
          cell: 'G11',
          error: 'Invalid data: Last Mile Technologies - Fibre',
          received: 'INVALID',
          expected: 'Yes/No value',
        },
        {
          level: 'cell',
          cell: 'G12',
          error: 'Invalid data: Last Mile Technologies - Cable',
          received: 'INVALID',
          expected: 'Yes/No value',
        },
        {
          level: 'cell',
          cell: 'G13',
          error: 'Invalid data: Last Mile Technologies - DSL',
          received: 'INVALID',
          expected: 'Yes/No value',
        },
        {
          level: 'cell',
          cell: 'G17',
          error: 'Invalid data: Last Mile Technologies - Mobile Wireless',
          received: 'null',
          expected: 'Yes/No value',
        },
        {
          level: 'cell',
          cell: 'G15',
          error: 'Invalid data: Last Mile Technologies - Fixed Wireless',
          received: 'INVALID',
          expected: 'Yes/No value',
        },
        {
          level: 'cell',
          cell: 'G16',
          error: 'Invalid data: Last Mile Technologies - Satellite',
          received: 'INVALID',
          expected: 'Yes/No value',
        },
        {
          level: 'cell',
          cell: 'D13',
          error: 'Invalid data: Effective Start Date',
          received: '',
          expected: 'Valid date',
        },
        {
          level: 'cell',
          cell: 'D14',
          error: 'Invalid data: Project Start Date',
          received: '',
          expected: 'Valid date',
        },
        {
          level: 'cell',
          cell: 'D15',
          error: 'Invalid data: Project Completion Date',
          received: '',
          expected: 'Valid date',
        },
        {
          level: 'cell',
          cell: 'D7',
          error: 'Invalid data: Applicant Name',
          received: '',
          expected: 'Non-empty value',
        },
        {
          level: 'cell',
          cell: 'D8',
          error: 'Invalid data: Project Title',
          received: '',
          expected: 'Non-empty value',
        },
        {
          level: 'cell',
          cell: 'D9',
          error: 'Invalid data: Province',
          received: '',
          expected: 'Non-empty value',
        },
      ],
    };

    expect(data).toEqual(expected);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
});
