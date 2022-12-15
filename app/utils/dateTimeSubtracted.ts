import { DateTime } from 'luxon';

const dateTimeSubtracted = (timeStamp: string, minutesToSubtract?: number) => {
  return DateTime.fromISO(timeStamp, {
    locale: 'en-CA',
    zone: 'America/Vancouver',
  })
    .minus({ minutes: minutesToSubtract || 0 })
    .toFormat('MMMM dd, yyyy, ttt');
};

export default dateTimeSubtracted;
