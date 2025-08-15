/**
 * @jest-environment node
 */
import { mocked } from 'jest-mock';
import * as XLSX from 'xlsx';
import { performQuery } from '../../../../backend/lib/graphql';
import { testApplicationData, testCbcData } from './testData';
import {
  generateApplicationData,
  generateCbcData,
  generateDashboardExport,
} from '../../../../backend/lib/dashboard/dashboard';

jest.mock('../../../../backend/lib/graphql');

describe('Dashboard export functions', () => {
  it('should generate application data', async () => {
    mocked(performQuery).mockImplementation(async () => {
      return testApplicationData;
    });
    const data = await generateApplicationData([1], null);
    expect(data).toBeDefined();
  });

  it('should generate cbc data', async () => {
    mocked(performQuery).mockImplementation(async () => {
      return testCbcData;
    });
    const data = await generateCbcData([1], null);
    expect(data).toBeDefined();
  });

  it('should return empty array when no id provided', async () => {
    const data = await generateApplicationData(null, null);
    expect(data).toEqual([]);
    const cbcData = await generateCbcData(null, null);
    expect(cbcData).toEqual([]);
  });

  it('should generate dashboard export', async () => {
    const blob = await generateDashboardExport(
      [testApplicationData],
      [testCbcData]
    );

    const arrayBuffer = await blob.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });

    const sheet = workbook.Sheets[workbook.SheetNames[0]];

    const ccbcRowData = [
      'CCBC',
      'CCBC-010001',
      null,
      6,
      1,
      'Conditionally Approved',
      'Conditionally Approved',
      'YES',
      'A testy test test',
      '',
      'A testing org',
      'YES',
      'ISED-UBF Core',
      null,
      'Last Mile',
      null,
      null,
      null,
      50,
      'TBD',
      null,
      'Vancouver Island and Coast',
      'Regional District of Mount Waddington',
      'Echo Bay,Gwayasdums 1',
      '26059,65365',
      2,
      1,
      635,
      null,
      null,
      null,
      55555,
      55555,
      2641556,
      null,
      null,
      4211861,
      null,
      '2022-12-15',
      '2023-10-10',
      null,
      '2023-02-01',
      '2028-03-31',
      null,
      null,
    ];

    const cbcRowData = [
      'CBC',
      5070,
      2,
      null,
      1,
      'Agreement Signed',
      'Agreement Signed',
      'NO',
      'Project 4',
      'Description 4',
      'Internet company 444',
      'NO',
      'ISED-CTI',
      null,
      'Transport',
      'Fibre',
      null,
      null,
      null,
      null,
      'Location 4',
      'Cariboo',
      'Cariboo Regional District',
      'Williams Lake 1',
      '65136',
      14,
      null,
      null,
      125,
      null,
      null,
      null,
      null,
      1641519,
      null,
      null,
      5633904,
      'YES',
      null,
      '2018-03-07',
      '2020-03-12',
      '2018-02-05',
      '2023-12-31',
      0.009899999999999999,
      null,
    ];

    ccbcRowData.forEach((expectedValue, index) => {
      if (!expectedValue) return;
      const cell = sheet[XLSX.utils.encode_cell({ r: 1, c: index })];
      expect(cell).toBeDefined();
      expect(cell.v).toBe(expectedValue);
    });

    cbcRowData.forEach((expectedValue, index) => {
      if (!expectedValue) return;
      const cell = sheet[XLSX.utils.encode_cell({ r: 2, c: index })];
      expect(cell).toBeDefined();
      expect(cell.v).toBe(expectedValue);
    });

    // handle empty location data correctly
    const datasetWithEmptyLocationData = {
      ...testApplicationData,
      data: {
        ...testApplicationData.data,
        allApplicationErs: null,
        allApplicationRds: null,
      },
    };
    const blobEmptyData = await generateDashboardExport(
      [datasetWithEmptyLocationData],
      [testCbcData]
    );

    // console.log(data);

    const arrayBufferEmptyData = await blobEmptyData.arrayBuffer();
    const workbook2 = XLSX.read(arrayBufferEmptyData, { type: 'array' });

    const sheet2 = workbook2.Sheets[workbook2.SheetNames[0]];
    const cellEr = sheet2[XLSX.utils.encode_cell({ r: 1, c: 21 })];
    const cellRd = sheet2[XLSX.utils.encode_cell({ r: 1, c: 22 })];

    expect(cellEr).not.toBeDefined();

    expect(cellRd).not.toBeDefined();
  });
});
