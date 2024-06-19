/**
 * @jest-environment node
 */
import {
  persistCbcCommunities,
  readCbcCommunitiesData,
} from 'backend/lib/excel_import/cbc_project_communities';
import { performQuery } from 'backend/lib/graphql';
import { mocked } from 'jest-mock';
import * as XLSX from 'xlsx';
import request from 'supertest';

jest.mock('backend/lib/graphql');

const columnList = {
  A: 'Geographic Names ID',
  I: 'Project Number',
};

describe('cbc_communities_data', () => {
  beforeEach(() => {
    jest.spyOn(XLSX, 'read').mockReturnValue({
      Sheets: { 'CBC Communities Data': {} },
      SheetNames: ['CBC Communities Data'],
    });
  });

  describe('cbc_project_communities', () => {
    it('should parse worksheet and group data by project number', async () => {
      jest.spyOn(XLSX.utils, 'sheet_to_json').mockReturnValue([
        columnList,
        {
          A: 2,
          I: 'Project 123',
        },
        {
          A: 3,
          I: 'Project 123',
        },
        {
          A: 4,
          I: 'Project 456',
        },
      ]);

      const wb = XLSX.read(null);
      const data = await readCbcCommunitiesData(
        wb,
        'CBC & CCBC Project Communities'
      );

      const expectedResponse = {
        'Project 123': [
          {
            communitiesSourceDataId: 2,
            cbcProjectNumber: 'Project 123',
            errorLog: [],
          },
          {
            communitiesSourceDataId: 3,
            cbcProjectNumber: 'Project 123',
            errorLog: [],
          },
        ],
        'Project 456': [
          {
            communitiesSourceDataId: 4,
            cbcProjectNumber: 'Project 456',
            errorLog: [],
          },
        ],
      };

      expect(data).toEqual(expectedResponse);
    });
  });

  it('should return validation errors for incorrect column headings', async () => {
    jest
      .spyOn(XLSX.utils, 'sheet_to_json')
      .mockReturnValue([{ A: 'Wrong Name', I: 'Wrong Name' }]);

    const wb = XLSX.read(null);
    const data = await readCbcCommunitiesData(wb, 'CBC Communities Data');
    expect(data).toEqual({
      error: [
        'Column heading "Wrong Name" in column A does not match expected name: "Geographic Names ID"',
        'Column heading "Wrong Name" in column I does not match expected name: "Project Number"',
      ],
    });
  });

  describe('persistCbcCommunities', () => {
    it('should create new communities for the given CBC project', async () => {
      const cbcId = 1;
      const existingCbcCommunities = [2];
      const cbcProjectCommunitiesFromSheet = [
        { communitiesSourceDataId: 2, cbcProjectNumber: 'Project 123' },
        { communitiesSourceDataId: 3, cbcProjectNumber: 'Project 123' },
      ];

      mocked(performQuery).mockImplementation(async (query) => {
        if (query.includes('createCbcProjectCommunityMutation')) {
          return {
            data: {
              createCbcProjectCommunity: {
                cbcProjectCommunity: {
                  cbcId,
                  communitiesSourceDataId: 3,
                },
              },
            },
          };
        }
        return { data: {} };
      });

      await persistCbcCommunities(
        cbcId,
        existingCbcCommunities,
        cbcProjectCommunitiesFromSheet,
        request
      );

      expect(performQuery).toHaveBeenCalledTimes(1);
      expect(performQuery).toHaveBeenCalledWith(
        expect.stringContaining('createCbcProjectCommunityMutation'),
        {
          input: {
            cbcProjectCommunity: {
              cbcId,
              communitiesSourceDataId: 3,
            },
          },
        },
        request
      );
    });

    it('should not create communities that already exist for the CBC project', async () => {
      const cbcId = 1;
      const existingCbcCommunities = [2, 3];
      const cbcProjectCommunitiesFromSheet = [
        { communitiesSourceDataId: 2, cbcProjectNumber: 'Project 123' },
        { communitiesSourceDataId: 3, cbcProjectNumber: 'Project 123' },
      ];

      await persistCbcCommunities(
        cbcId,
        existingCbcCommunities,
        cbcProjectCommunitiesFromSheet,
        request
      );

      expect(performQuery).not.toHaveBeenCalled();
    });
  });
});
