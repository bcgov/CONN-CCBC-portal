/**
 * @jest-environment node
 */
import { mocked } from 'jest-mock';
import request from 'supertest';
import * as XLSX from 'xlsx';
import { performQuery } from '../../../backend/lib/graphql';
import LoadTab2Data from '../../../backend/lib/sow_import/tab_2';

jest.mock('../../../backend/lib/graphql');

describe('sow_tab_2', () => {
  beforeEach(() => {
    mocked(performQuery).mockImplementation(async () => {
      return {};
    });
    jest.spyOn(XLSX, 'read').mockReturnValue({
      Sheets: { Sheet1: {} },
      SheetNames: ['2'],
    });
  });
  it('should parse worksheet and return error if no data found', async () => {
    jest
      .spyOn(XLSX.utils, 'sheet_to_json')
      .mockReturnValue([{ a: 1, b: 2, c: 3 }]);
    const wb = XLSX.read(null);

    const data = await LoadTab2Data(1, wb, '2', request);

    expect(data).toEqual({
      error: [
        {
          cell: null,
          error: 'Invalid data: No completed Project Site rows found',
          expected: 'at least 1 completed row',
          received: '0 completed',
        },
      ],
    });
  });

  it('should parse worksheet and submit expected mutation', async () => {
    const fakeTab2 = [
      { AG: 122 },
      { A: 'Step 2. Project Sites' },
      { AD: 'Total', AF: 122 },
      {
        A: 'Entry Number',
        B: 'Project Site Name',
        C: 'Project Site Identifier',
        D: 'Project Site Type',
        E: 'Project Site Location ',
        G: 'New or Existing Site',
        H: 'Is the Site a POP?',
        I: 'Is the Site an Internet Gateway  External to the New Network?',
        J: 'Land Access Type',
        K: 'Short Description and Comments',
        L: 'Milestone Deliverable Completion Dates',
        O: 'Information Complete',
        P: 'Message Center',
      },
      {
        E: 'Latitude',
        F: 'Longitude',
        L: 'Milestone 1',
        M: 'Milestone 2',
        N: 'Milestone 3',
        S: 'Invalid Data. ',
        T: 'Duplicate Site ID. ',
        U: 'Missing Info. ',
        V: 'Invalid MS Dates. ',
        W: 'At least one cell has to be filled-in. ',
        X: 'Missing App Num. ',
        Y: '?',
        Z: 'Missing Equipment for Site. ',
      },
      {
        A: 1,
        B: 'Site A1',
        C: 'A1',
        D: 'Water Tower',
        E: 40,
        F: -145,
        G: 'New',
        H: 'No',
        I: 'No',
        J: 'Owned',
        K: 'Edge, Interconnected, Linked',
        L: 45199,
        M: 45382,
        N: 45657,
        O: 'Complete',
        P: '',
        S: 0,
        T: true,
        U: true,
        V: true,
        W: true,
        Z: true,
      },
      {
        A: 2,
        B: 'Site A2',
        C: 'A2',
        D: 'Water Tower',
        E: 40,
        F: -145,
        G: 'Existing',
        H: 'No',
        I: 'No',
        J: 'Owned',
        K: 'Edge, Interconnected, Linked',
        L: 45199,
        M: 45382,
        N: 45657,
        O: 'Complete',
        P: '',
        S: 0,
        T: true,
        U: true,
        V: true,
        W: true,
        Z: true,
      },
      {
        A: 3,
        B: 'Site A3',
        C: 'A3',
        D: 'Water Tower',
        E: 40,
        F: -145,
        G: 'New',
        H: 'No',
        I: 'No',
        J: 'Owned',
        K: 'Edge, Interconnected, Linked',
        L: 45199,
        M: 45382,
        N: 45657,
        O: 'Complete',
        P: '',
        S: 0,
        T: true,
        U: true,
        V: true,
        W: true,
        Z: true,
      },
    ];

    const expectedInput = {
      input: {
        jsonData: [
          {
            entryNumber: 1,
            projectSiteName: 'Site A1',
            projectSiteIdentifier: 'A1',
            projectSiteType: 'Water Tower',
            latitude: 40,
            longitude: -145,
            newOrExisting: 'New',
            isSitePop: false,
            isSiteGateway: false,
            landAccessType: 'Owned',
            description: 'Edge, Interconnected, Linked',
            milestone1: '2023-09-30T00:00:00.000Z',
            milestone2: '2024-03-31T00:00:00.000Z',
            milestone3: '2024-12-31T00:00:00.000Z',
          },
          {
            entryNumber: 2,
            projectSiteName: 'Site A2',
            projectSiteIdentifier: 'A2',
            projectSiteType: 'Water Tower',
            latitude: 40,
            longitude: -145,
            newOrExisting: 'Existing',
            isSitePop: false,
            isSiteGateway: false,
            landAccessType: 'Owned',
            description: 'Edge, Interconnected, Linked',
            milestone1: '2023-09-30T00:00:00.000Z',
            milestone2: '2024-03-31T00:00:00.000Z',
            milestone3: '2024-12-31T00:00:00.000Z',
          },
          {
            entryNumber: 3,
            projectSiteName: 'Site A3',
            projectSiteIdentifier: 'A3',
            projectSiteType: 'Water Tower',
            latitude: 40,
            longitude: -145,
            newOrExisting: 'New',
            isSitePop: false,
            isSiteGateway: false,
            landAccessType: 'Owned',
            description: 'Edge, Interconnected, Linked',
            milestone1: '2023-09-30T00:00:00.000Z',
            milestone2: '2024-03-31T00:00:00.000Z',
            milestone3: '2024-12-31T00:00:00.000Z',
          },
        ],
        sowId: 1,
      },
    };

    jest.spyOn(XLSX.utils, 'sheet_to_json').mockReturnValue(fakeTab2);
    const wb = XLSX.read(null);

    await LoadTab2Data(1, wb, '2', request);
    expect(performQuery).toHaveBeenCalledWith(
      expect.anything(),
      expectedInput,
      expect.anything()
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
