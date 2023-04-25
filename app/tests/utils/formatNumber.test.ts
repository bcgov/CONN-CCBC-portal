import formatNumber from '../../utils/formatNumber';

describe('formatNumber', () => {
  it('should return a whole number', () => {
    expect(formatNumber(1)).toEqual(1);
  });

  it('should return a number with 2 decimal places and a zero on the end', () => {
    expect(formatNumber(1.1)).toEqual(1.1);
  });

  it('should return a number with 2 decimal places', () => {
    expect(formatNumber(1.11)).toEqual(1.11);
  });

  it('should round to two decimal places', () => {
    expect(formatNumber(1.115)).toEqual(1.11);
  });
});
