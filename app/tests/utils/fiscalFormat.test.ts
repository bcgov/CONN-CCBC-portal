import { getFiscalQuarter, getFiscalYear } from 'utils/fiscalFormat';

describe('the getFiscalQuarter function', () => {
  it('should return the correct fiscal quarter for Q1', () => {
    const result = getFiscalQuarter('2020-04-01');
    expect(result).toEqual('Q1 (Apr-Jun)');
  });

  it('should return the correct fiscal quarter for Q2', () => {
    const result = getFiscalQuarter('2020-07-01');
    expect(result).toEqual('Q2 (Jul-Sep)');
  });

  it('should return the correct fiscal quarter for Q3', () => {
    const result = getFiscalQuarter('2020-10-01');
    expect(result).toEqual('Q3 (Oct-Dec)');
  });

  it('should return the correct fiscal quarter for Q4', () => {
    const result = getFiscalQuarter('2020-01-01');
    expect(result).toEqual('Q4 (Jan-Mar)');
  });

  it('should return null if the date is null', () => {
    const result = getFiscalQuarter(null);
    expect(result).toEqual(null);
  });
});

describe('the getFiscalYear function', () => {
  it('should return the correct fiscal year', () => {
    const result = getFiscalYear('2023-04-01');
    expect(result).toEqual('2023-24');
  });

  it('should return the previous fiscal year for fourth quarter', () => {
    const result = getFiscalYear('2025-03-31');
    expect(result).toEqual('2024-25');
  });

  it('should return null if the date is null', () => {
    const result = getFiscalYear(null);
    expect(result).toEqual(null);
  });
});
