import { DateTime } from 'luxon';

export const PACIFIC_TIME_ZONE = 'America/Vancouver';
const PACIFIC_TIME_LABEL = 'PCT';

// Display policy: use PCT from the start of the permanent Pacific Time regime.
// March 9, 2026 midnight in Vancouver is 07:00 UTC (OIC 63/2026).
// https://www.bclaws.gov.bc.ca/civix/document/id/oic/oic_cur/0063_2026
const PCT_LABEL_START = DateTime.fromISO(
  '2026-03-09T00:00:00-07:00'
).toMillis();

/**
 * Luxon gets timezone names from Node/browser Intl data, which may not use
 * B.C.'s PCT abbreviation even when the UTC offset is correct. This shared
 * formatter keeps portal screens and reports consistent: historical dates
 * retain their PST/PDT labels, while dates from PCT_LABEL_START display PCT.
 * The cutoff applies to the timestamp being formatted, not the current date.
 *
 * Custom formats support the PCT override only for ZZZZ (short zone name).
 * The z and ZZZZZ tokens retain Luxon's output. Only the label is overridden;
 * Vancouver's clock-time conversions still require updated runtime timezone data.
 */
const formatPacificDateTime = (dateTime: DateTime, format?: string): string => {
  const pacificDateTime = dateTime
    .setZone(PACIFIC_TIME_ZONE)
    .setLocale('en-CA');
  if (!pacificDateTime.isValid) {
    return pacificDateTime.toLocaleString(DateTime.DATETIME_FULL);
  }

  const usePctLabel = pacificDateTime.toMillis() >= PCT_LABEL_START;
  if (format) {
    return pacificDateTime.toFormat(
      usePctLabel
        ? format.replace(/\bZZZZ\b/g, `'${PACIFIC_TIME_LABEL}'`)
        : format
    );
  }

  return pacificDateTime
    .toLocaleParts(DateTime.DATETIME_FULL)
    .map(({ type, value }) =>
      type === 'timeZoneName' && usePctLabel ? PACIFIC_TIME_LABEL : value
    )
    .join('');
};

export default formatPacificDateTime;
