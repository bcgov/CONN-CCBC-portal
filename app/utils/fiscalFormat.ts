import { DateTime } from 'luxon';

const getFiscalQuarter = (date) => {
  if (!date) return null;
  const { month } = DateTime.fromJSDate(new Date(date)).setZone('UTC');

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
  const { year, month } = DateTime.fromJSDate(new Date(date)).setZone('UTC');
  const startYear = month <= 3 ? year - 1 : year;
  const shortenedYear = startYear % 100;
  return `${startYear}-${shortenedYear + 1}`;
};

export { getFiscalQuarter, getFiscalYear };
