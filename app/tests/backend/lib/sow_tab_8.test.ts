/**
 * @jest-environment node
 */
import { mocked } from 'jest-mock';
import request from 'supertest';
import * as XLSX from 'xlsx';
import { performQuery } from '../../../backend/lib/graphql';
import LoadTab8ata from '../../../backend/lib/sow_import/tab_8';

jest.mock('../../../backend/lib/graphql');

describe('sow_tab_8', () => {
  beforeEach(() => {
    mocked(performQuery).mockImplementation(async () => {
      return {};
    });
    jest.spyOn(XLSX, 'read').mockReturnValue({
      Sheets: { Sheet1: {} },
      SheetNames: ['8'],
    });
  });
  it('should parse worksheet and return error if no data found', async () => {
    jest
      .spyOn(XLSX.utils, 'sheet_to_json')
      .mockReturnValue([{ a: 1, b: 2, c: 3 }]);

    const wb = XLSX.read(null);
    const data = await LoadTab8ata(1, wb, '8', request);

    expect(data).toEqual({
      error: [
        {
          level: 'table',
          cell: null,
          error: 'Wrong number of rows on Tab 8',
          received: '1 rows',
          expected: 'at least 20 rows',
        },
      ],
    });
  });

  it('should parse worksheet and return error if no complete rows found', async () => {
    const fakeTab8 = [
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {
        B: 'Number of Communities Impacted',
        E: 3,
      },
      {
        B: 'Number of Indigenous Communities Impacted',
        E: 2,
      },
      {},
      {
        A: 'Project Zone',
      },
      {
        A: 1,
        B: 1892,
        C: 'Lindeman',
        D: 'Locality',
        E: 59.7831,
        F: -135.085451,
        G: 'Open Map',
        I: 'Open Map',
        J: 'https://apps.gov.bc.ca/pub/bcgnws/names/1892.html',
        K: 'N',
        M: 'Incomplete',
      },
      {},
    ];

    jest.spyOn(XLSX.utils, 'sheet_to_json').mockReturnValue(fakeTab8);
    const wb = XLSX.read(null);

    const data = await LoadTab8ata(1, wb, '8', request);

    expect(data).toEqual({
      error: [
        {
          level: 'table',
          cell: 'Geographic Names table',
          error: 'Invalid data: No completed Geographic Names rows found',
          received: '0 completed rows',
          expected: 'at least 1 completed row',
        },
      ],
    });
  });

  it('should parse worksheet and submit expected mutation', async () => {
    const fakeTab8 = [
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {
        B: 'Number of Communities Impacted',
        E: 3,
      },
      {
        B: 'Number of Indigenous Communities Impacted',
        E: 2,
      },
      {},
      {
        A: 'Project Zone',
      },
      {
        A: 1,
        B: 1892,
        C: 'Lindeman',
        D: 'Locality',
        E: 59.7831,
        F: -135.085451,
        G: 'Open Map',
        I: 'Open Map',
        J: 'https://apps.gov.bc.ca/pub/bcgnws/names/1892.html',
        K: 'N',
        M: 'Complete',
      },
    ];

    const expectedInput = {
      input: {
        jsonData: {
          communitiesNumber: 3,
          indigenousCommunitiesNumber: 2,
          geoNames: [
            {
              projectZone: 1,
              geoNameId: 1892,
              bcGeoName: 'Lindeman',
              geoType: 'Locality',
              latitude: 59.7831,
              longitude: -135.085451,
              impacted: undefined,
              mapLink: 'https://apps.gov.bc.ca/pub/bcgnws/names/1892.html',
              indigenous: 'N',
            },
          ],
        },
        sowId: 1,
      },
    };

    jest.spyOn(XLSX.utils, 'sheet_to_json').mockReturnValue(fakeTab8);
    const wb = XLSX.read(null);

    await LoadTab8ata(1, wb, '8', request);
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
