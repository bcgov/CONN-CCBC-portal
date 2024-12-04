/**
 * @jest-environment node
 */
import { mocked } from 'jest-mock';
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

  it('should generate dashboard export', async () => {
    const blob = await generateDashboardExport(
      [testApplicationData],
      [testCbcData]
    );
    expect(blob).toBeDefined();
  });
});
