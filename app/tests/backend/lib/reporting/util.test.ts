/**
 * @jest-environment node
 */

import {
  compareAndMarkArrays,
  convertStatus,
} from 'backend/lib/reporting/util';

describe('Dashboard util functions', () => {
  it('should return "Conditionally Approved" for "conditionally_approved"', () => {
    expect(convertStatus('conditionally_approved')).toBe(
      'Conditionally Approved'
    );
  });

  it('should return "Agreement Signed" for "approved"', () => {
    expect(convertStatus('approved')).toBe('Agreement Signed');
  });

  it('should return "On Hold" for "on_hold"', () => {
    expect(convertStatus('on_hold')).toBe('On Hold');
  });

  it('should return "Not selected" for "closed"', () => {
    expect(convertStatus('closed')).toBe('Not selected');
  });

  it('should return "Recommendation" for "recommendation"', () => {
    expect(convertStatus('recommendation')).toBe('Recommendation');
  });

  it('should return "Reporting Complete" for "complete"', () => {
    expect(convertStatus('complete')).toBe('Reporting Complete');
  });

  describe('compareAndMarkArrays percentage normalization', () => {
    const headerRow = [
      { value: 'Col0' },
      { value: 'Col1' },
      { value: 'Col2' },
      { value: 'Col3' },
      { value: 'Col4' },
      { value: 'Project #' },
      { value: '% Project Milestone Complete' },
      { value: 'Changelog' },
    ];

    const buildRow = (id: string, percentValue: string) => [
      { value: 'v0' },
      { value: 'v1' },
      { value: 'v2' },
      { value: 'v3' },
      { value: 'v4' },
      { value: id },
      { value: percentValue },
      { value: '' },
    ];

    it('treats "13%" and "0.13" as equivalent', () => {
      const array1 = [headerRow, buildRow('ID1', '13%')];
      const array2 = [headerRow, buildRow('ID1', '0.13')];

      const result = compareAndMarkArrays(array1, array2);

      expect(result[1][6].backgroundColor).toBeUndefined();
      expect(result[1][7].value).toBe('');
    });

    it('marks changes when normalized percentage differs', () => {
      const array1 = [headerRow, buildRow('ID1', '13%')];
      const array2 = [headerRow, buildRow('ID1', '0.12')];

      const result = compareAndMarkArrays(array1, array2);

      expect(result[1][6].backgroundColor).toBe('#2FA7DD');
      expect(result[1][7].value).toContain('% Project Milestone Complete');
    });
  });
});
