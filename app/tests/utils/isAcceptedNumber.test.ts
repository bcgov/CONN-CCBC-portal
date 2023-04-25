import isAcceptedNumber from '../../utils/isAcceptedNumber';

describe('isAcceptedNumber', () => {
  it('should return true for a whole number', () => {
    expect(isAcceptedNumber(1)).toEqual(true);
  });

  it('should return true for a number with 2 decimal places', () => {
    expect(isAcceptedNumber(1.11)).toEqual(true);
  });

  it('should return true for a number with 1 decimal place', () => {
    expect(isAcceptedNumber(1.1)).toEqual(true);
  });

  it('should return false for a string', () => {
    expect(isAcceptedNumber('string')).toEqual(false);
  });

  it('should return false for a number with 3 decimal places', () => {
    expect(isAcceptedNumber(1.111)).toEqual(false);
  });
});
