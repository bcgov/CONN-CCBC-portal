import { DateTime } from 'luxon';
import formatPacificDateTime from 'utils/formatPacificDateTime';
import { dateTimeFormat } from 'lib/theme/functions/formatDates';

describe('Pacific timezone display policy', () => {
  it.each([
    ['2025-01-15T18:00:00Z', '2025-01-15 10:00', 'PST'],
    ['2025-07-15T17:00:00Z', '2025-07-15 10:00', 'PDT'],
    ['2026-03-08T09:59:59Z', '2026-03-08 01:59', 'PST'],
    ['2026-03-08T10:00:00Z', '2026-03-08 03:00', 'PDT'],
    ['2026-03-09T06:59:59.999Z', '2026-03-08 23:59', 'PDT'],
    ['2026-03-09T07:00:00Z', '2026-03-09 00:00', 'PCT'],
    ['2027-07-15T17:00:00Z', '2027-07-15 10:00', 'PCT'],
  ])(
    'labels %s without changing its Vancouver clock time',
    (iso, expectedTime, expectedLabel) => {
      const dateTime = DateTime.fromISO(iso, { zone: 'UTC' });
      expect(formatPacificDateTime(dateTime, 'yyyy-MM-dd HH:mm ZZZZ')).toBe(
        `${expectedTime} ${expectedLabel}`
      );
      expect(formatPacificDateTime(dateTime)).toContain(expectedLabel);
      expect(dateTime.toUTC().toISO()).toBe(
        DateTime.fromISO(iso).toUTC().toISO()
      );
    }
  );

  it.each([
    ['2026-03-09T06:59:59.999Z', '2026-03-08 23:59:59.999 PDT'],
    ['2026-03-09T07:00:00Z', '2026-03-09 00:00:00.000 PCT'],
    ['2026-03-09T03:00:00-04:00', '2026-03-09 00:00:00.000 PCT'],
  ])('applies the same boundary to custom formats for %s', (iso, expected) => {
    expect(
      formatPacificDateTime(
        DateTime.fromISO(iso, { setZone: true }),
        'yyyy-MM-dd HH:mm:ss.SSS ZZZZ'
      )
    ).toBe(expected);
  });

  it('uses PCT for future winter labels independently of runtime zone names', () => {
    // This asserts the label policy, not correctness of the runtime's winter offset.
    expect(
      formatPacificDateTime(DateTime.fromISO('2026-12-01T17:00:00Z'), 'ZZZZ')
    ).toBe('PCT');
  });

  it('converts the input zone and locale to the portal display convention', () => {
    const dateTime = DateTime.fromISO('2025-01-15T13:00:00-05:00', {
      setZone: true,
      locale: 'fr-CA',
    });
    const expectedDateTime = DateTime.fromObject(
      { year: 2025, month: 1, day: 15, hour: 10 },
      { zone: 'America/Vancouver', locale: 'en-CA' }
    );
    expect(formatPacificDateTime(dateTime)).toBe(
      expectedDateTime.toLocaleString(DateTime.DATETIME_FULL)
    );
  });

  it('preserves invalid-date handling', () => {
    expect(formatPacificDateTime(DateTime.invalid('Invalid input'))).toBe(
      'Invalid DateTime'
    );
  });

  it('labels submission times while preserving machine-readable offsets', () => {
    const date = new Date('2025-01-15T18:00:00Z');
    expect(dateTimeFormat(date, 'minutes_time_only')).toBe('10:00 a.m. (PST)');
    expect(dateTimeFormat(date, 'timestamptz')).toBe(
      '2025-01-15 10:00:00.000-8'
    );
  });

  it('preserves date-only and numeric-offset formats after the label cutoff', () => {
    const date = new Date('2026-03-09T07:00:00Z');
    expect(dateTimeFormat(date, 'date_year_first')).toBe('2026-03-09');
    expect(dateTimeFormat(date, 'minutes_time_only')).toBe('12:00 a.m. (PCT)');
    expect(dateTimeFormat(date, 'timestamptz')).toBe(
      '2026-03-09 00:00:00.000-7'
    );
  });
});
