import dateTimeSubtracted from 'utils/dateTimeSubtracted';

describe('The isRouteAuthorized function', () => {
  it('returns the correct subtracted datetime', () => {
    expect(dateTimeSubtracted('2023-03-15T00:00:00-07:00', 30)).toBe(
      'March 14, 2023, 11:30:00 p.m. PDT'
    );
  });

  it('returns the correct datetime with no minutes passed in', () => {
    expect(dateTimeSubtracted('2023-03-15T00:00:00-07:00')).toBe(
      'March 15, 2023, 12:00:00 a.m. PDT'
    );
  });

  it('returns the correct datetime with 0 minutes passed in', () => {
    expect(dateTimeSubtracted('2023-03-15T00:00:00-07:00', 0)).toBe(
      'March 15, 2023, 12:00:00 a.m. PDT'
    );
  });
});
