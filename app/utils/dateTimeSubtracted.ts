import { DateTime } from 'luxon';

const dateTimeSubtracted = (timeStamp, minutes) => {
  // not ideal but checking type here for now due mockOpenIntake applicantportal/index test mocking useFeature and returning object
  const minutesToSubtract = typeof minutes === 'number' ? minutes : 0;
  return DateTime.fromISO(timeStamp, {
    locale: 'en-CA',
    zone: 'America/Vancouver',
  })
    .minus({ minutes: minutesToSubtract })
    .toFormat('MMMM dd, yyyy, ttt');
};

export default dateTimeSubtracted;
