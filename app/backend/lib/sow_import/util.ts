import * as luxon from 'luxon';

export const convertExcelDropdownToBoolean = (excelVal: 'Yes' | 'No') => {
  if (excelVal === 'Yes') {
    return true;
  }
  if (excelVal === 'No') {
    return false;
  }
  return undefined;
};

export const convertExcelDateToJSDate = (date) => {
  if (typeof date === 'string') {
    const d = luxon.DateTime.fromSQL(date).toJSDate();
    if (d.toString() !== 'Invalid Date') {
      return d;
    }
  }
  if (typeof date === 'number') {
    return new Date(Math.round((date - 25569) * 86400 * 1000)).toISOString();
  }
  return null;
};
