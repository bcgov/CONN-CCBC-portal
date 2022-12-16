import { DateTime } from "luxon";

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
  date_year_first: 'yyyy-MM-dd',
  timestamptz: 'yyyy-MM-dd HH:mm:ss.SSSZ',
  seconds: 'MMM d, yyyy hh:mm:ss A (ZZZZ)',
  minutes: 'MMM d, yyyy hh:mm A (ZZZZ)',
  days_numbered: 'dd-MM-yyyy',
  days_string: 'MMMM Do, yyyy',
  minutes_time_only: 'hh:mm a (ZZZZ)'
};

// Adds a default timestamp to yyyy-MM-dd dates without overwriting pre-existing timestamps:
// (date strings returned by DatePickerWidget are 10 chars)
export const ensureFullTimestamp = (
  dateStr: string,
  time: { hour: number; minute: number; second: number; millisecond: number }
  ) => {
    if (dateStr.length > 10) return dateStr;
    try { 
      const fullDate = DateTime.fromFormat(dateStr, "yyyy-MM-dd"); 
      const fullTimestamp = fullDate 
      .setLocale("en-CA")
      .setZone(TIMEZONE)
      .set({
        hour: time.hour,
        minute: time.minute,
        second: time.second,
        millisecond: time.millisecond
      }).toISO(); 
      return fullTimestamp.replace('T',' ');
    }
    catch(e) {
      console.log(e);
      return dateStr;
    }
}

export const dateTimeFormat = (
  dateTime: Date | undefined,
  format: DTFormat
) => { 
 
  if(dateTime !== undefined) {
     
    try {
      const dateValue = (dateTime.valueOf() as number)/1000;
      const fullDate = DateTime.fromSeconds(dateValue).setZone(TIMEZONE);
      return fullDate.toFormat(FORMAT_TYPE[format]); 
    } catch (e) {
      console.log(e);

      throw e;
    }
  }
  else {
    return dateTime.toString();
  }
};

export const fixDate = (originalDate) => {
  const offset = 1000 * (new Date()).getTimezoneOffset() * 60;
  const adjusted = (new Date(originalDate)).getTime() + offset;
  const format = new Date(adjusted);
  return format;
}
