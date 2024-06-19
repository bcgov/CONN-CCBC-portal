/**
 * @jest-environment node
 */
import { mocked } from 'jest-mock';
import * as XLSX from 'xlsx';
import request from 'supertest';
import { performQuery } from 'backend/lib/graphql';
import LoadCommunitiesSourceData from 'backend/lib/excel_import/communities_source_data';

jest.mock('../../../../backend/lib/graphql');

const columnList = {
  A: 'Geographic Name ID',
  B: 'BC Geographic Name',
  C: 'Type',
  D: 'Regional District',
  E: 'Economic Region',
  F: 'Latitude',
  G: 'Longitude',
  H: 'CSDUID',
  I: 'Map Link (for verifying)',
};

describe('communities_source_data', () => {
  beforeEach(() => {
    jest.spyOn(XLSX, 'read').mockReturnValue({
      Sheets: { 'Communities Source Data': {} },
      SheetNames: ['Communities Source Data'],
    });
  });

  it('should parse worksheet', async () => {
    jest.spyOn(XLSX.utils, 'sheet_to_json').mockReturnValue([
      { ...columnList },
      {
        A: 2,
        B: 'Test geographic name',
        C: 'Community',
        D: 'Test regional district',
        E: 'test economic region',
        F: 121.122,
        G: 263.123,
        H: 123,
        I: 'link',
      },
    ]);

    mocked(performQuery).mockImplementation(async () => {
      return {
        data: {
          createCommunitiesSourceData: {
            communitiesSourceData: {
              id: '2',
            },
            clientMutationId: '2',
          },
          updateCommunitiesSourceData: {
            communitiesSourceData: {
              id: '1',
            },
            clientMutationId: '1',
          },
          findCommunitiesSourceData: {
            communitiesSourceDataByGeographicNameId: {
              nodes: [
                {
                  id: '1',
                  geographicNameId: 1,
                  bcGeographicName: 'Test geographic name 1',
                  type: 'Community 1',
                  regionalDistrict: 'Test regional district 1',
                  economicRegion: 'test economic region 1',
                  latitude: 121.122,
                  longitude: 263.123,
                  csduid: 123,
                  mapLink: 'link',
                },
              ],
            },
          },
        },
      };
    });

    const wb = XLSX.read(null);
    const data = await LoadCommunitiesSourceData(
      wb,
      'Communities Source Data',
      request
    );
    expect(data).toEqual({
      '0': {
        data: {
          createCommunitiesSourceData: {
            clientMutationId: '2',
            communitiesSourceData: {
              id: '2',
            },
          },
          updateCommunitiesSourceData: {
            clientMutationId: '1',
            communitiesSourceData: {
              id: '1',
            },
          },
          findCommunitiesSourceData: {
            communitiesSourceDataByGeographicNameId: {
              nodes: [
                {
                  id: '1',
                  geographicNameId: 1,
                  bcGeographicName: 'Test geographic name 1',
                  type: 'Community 1',
                  regionalDistrict: 'Test regional district 1',
                  economicRegion: 'test economic region 1',
                  latitude: 121.122,
                  longitude: 263.123,
                  csduid: 123,
                  mapLink: 'link',
                },
              ],
            },
          },
        },
      },
      errorLog: [],
    });
  });

  it('should return validation errors for incorrect column headings', async () => {
    jest.spyOn(XLSX.utils, 'sheet_to_json').mockReturnValue([
      {
        A: 'Wrong Name',
        B: 'Wrong Name',
        C: 'Wrong Name',
        D: 'Wrong Name',
        E: 'Wrong Name',
        F: 'Wrong Name',
        G: 'Wrong Name',
        H: 'Wrong Name',
        I: 'Wrong Name',
      },
    ]);

    const wb = XLSX.read(null);
    const data = await LoadCommunitiesSourceData(
      wb,
      'Communities Source Data',
      request
    );
    expect(data).toEqual({
      error: [
        'Column heading "Wrong Name" in column A does not match expected name: "Geographic Name ID"',
        'Column heading "Wrong Name" in column B does not match expected name: "BC Geographic Name"',
        'Column heading "Wrong Name" in column C does not match expected name: "Type"',
        'Column heading "Wrong Name" in column D does not match expected name: "Regional District"',
        'Column heading "Wrong Name" in column E does not match expected name: "Economic Region"',
        'Column heading "Wrong Name" in column F does not match expected name: "Latitude"',
        'Column heading "Wrong Name" in column G does not match expected name: "Longitude"',
        'Column heading "Wrong Name" in column H does not match expected name: "CSDUID"',
        'Column heading "Wrong Name" in column I does not match expected name: "Map Link (for verifying)"',
      ],
    });
  });
});
