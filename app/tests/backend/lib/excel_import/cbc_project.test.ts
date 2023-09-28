/**
 * @jest-environment node
 */
import { mocked } from 'jest-mock';
import * as XLSX from 'xlsx';
import request from 'supertest';
import { performQuery } from '../../../../backend/lib/graphql';
import LoadCbcProjectData from '../../../../backend/lib/excel_import/cbc_project';

jest.mock('../../../../backend/lib/graphql');

describe('cbc_project', () => {
  beforeEach(() => {
    mocked(performQuery).mockImplementation(async () => {
      return {
        data: {
          createCbcProject: {
            cbcProject: {
              id: '1',
              rowId: 1,
              jsonData: {},
            },
            clientMutationId: '1',
          },
        },
      };
    });
    jest.spyOn(XLSX, 'read').mockReturnValue({
      Sheets: { 'CBC Project': {} },
      SheetNames: ['CBC Project'],
    });
  });
  it('should parse worksheet', async () => {
    jest
      .spyOn(XLSX.utils, 'sheet_to_json')
      .mockReturnValue([{ A: 121231, B: 2, C: 3, D: 4, E: 5 }]);

    const wb = XLSX.read(null);
    const data = await LoadCbcProjectData(wb, 'CBC Project', null, request);

    expect(data).toEqual({
      data: {
        createCbcProject: {
          cbcProject: {
            id: '1',
            rowId: 1,
            jsonData: {},
          },
          clientMutationId: '1',
        },
      },
    });
  });
});
