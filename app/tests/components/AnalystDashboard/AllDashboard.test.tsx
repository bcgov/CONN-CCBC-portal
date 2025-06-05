import { filterNumber } from 'components/AnalystDashboard/AllDashboard'; // adjust path as needed

describe('filterNumber', () => {
  it('returns false when value is not a number', () => {
    const mockRow = {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      getValue: (id: string) => {
        return undefined;
      },
    };

    const result = filterNumber(mockRow, 'someId', '123');
    expect(result).toBe(false);
  });

  it('returns true when value is a number and matches filterValue', () => {
    const mockRow = {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      getValue: (id: string) => {
        return 123;
      },
    };

    const result = filterNumber(mockRow, 'someId', 123);
    expect(result).toBe(true);
  });

  it('returns false when value is a number but does not match filterValue', () => {
    const mockRow = {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      getValue: (id: string) => {
        return 123;
      },
    };

    const result = filterNumber(mockRow, 'someId', 456);
    expect(result).toBe(false);
  });
});
