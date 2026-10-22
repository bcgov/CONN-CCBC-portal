import dateTimeSubtracted from 'utils/dateTimeSubtracted';

describe('dateTimeSubtracted', () => {
  it('uses the historical label when subtracting across the PCT cutoff', () => {
    expect(dateTimeSubtracted('2026-03-09T00:15:00-07:00', 30)).toBe(
      'March 08, 2026, 11:45:00 p.m. PDT'
    );
  });

  it('uses PCT when the displayed deadline is at the cutoff', () => {
    expect(dateTimeSubtracted('2026-03-09T00:30:00-07:00', 30)).toBe(
      'March 09, 2026, 12:00:00 a.m. PCT'
    );
  });

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
