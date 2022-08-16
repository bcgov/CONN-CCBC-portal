import moment from 'moment-timezone';
import { SetStateAction } from 'react';

type FormatType = {
  date_year_first: string;
  timestamptz: string;
  seconds: string;
  minutes: string;
  days_numbered: string;
  days_string: string;
  minutes_time_only: string;
};

type DTFormat = keyof FormatType;

const TIMEZONE = 'America/Vancouver';
const FORMAT_TYPE: FormatType = {
  date_year_first: 'YYYY-MM-DD',
  timestamptz: 'YYYY-MM-DD HH:mm:ss.SSSZ',
  seconds: 'MMM D, YYYY hh:mm:ss A (z)',
  minutes: 'MMM D, YYYY hh:mm A (z)',
  days_numbered: 'DD-MM-YYYY',
  days_string: 'MMMM Do, YYYY',
  minutes_time_only: 'hh:mm A (z)'
};

// Adds a default timestamp to yyyy-MM-dd dates without overwriting pre-existing timestamps:
// (date strings returned by DatePickerWidget are 10 chars)
export const ensureFullTimestamp = (
  dateStr: string,
  time: { hour: number; minute: number; second: number; millisecond: number }
) => {
  const fullTimestamp =
    dateStr.length > 10
      ? dateStr
      : moment(dateStr)
          .hour(time.hour)
          .minute(time.minute)
          .second(time.second)
          .millisecond(time.millisecond)
          .format(FORMAT_TYPE.timestamptz);
  return fullTimestamp;
};

export const dateTimeFormat = (
  dateTime: SetStateAction<Date | undefined>,
  format: DTFormat
) => {
  return moment.tz(dateTime, TIMEZONE).format(FORMAT_TYPE[format]);
};

export const nowMoment = () => {
  return moment.tz(TIMEZONE);
};

export const defaultMoment = (dateTime: string) => {
  return moment.tz(dateTime, TIMEZONE);
};
