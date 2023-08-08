import { DateTime } from 'luxon';

const getFiscalQuarter = (date) => {
  if (!date) return null;
  const { month } = DateTime.fromJSDate(new Date(date));

  if (month >= 1 && month <= 3) {
    return 'Q4 (Jan-Mar)';
  }
  if (month >= 4 && month <= 6) {
    return 'Q1 (Apr-Jun)';
  }
  if (month >= 7 && month <= 9) {
    return 'Q2 (Jul-Sep)';
  }
  if (month >= 10 && month <= 12) {
    return 'Q3 (Oct-Dec)';
  }
  return null;
};

const getFiscalYear = (date) => {
  if (!date) return null;
  const { year } = DateTime.fromJSDate(new Date(date));
  const shortenedYear = year % 100;
  return `${year}-${shortenedYear + 1}`;
};

export { getFiscalQuarter, getFiscalYear };
