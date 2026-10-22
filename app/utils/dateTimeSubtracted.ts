import { DateTime } from 'luxon';
import formatPacificDateTime, {
  PACIFIC_TIME_ZONE,
} from './formatPacificDateTime';

const dateTimeSubtracted = (timeStamp, minutes) => {
  // not ideal but checking type here for now due mockOpenIntake applicantportal/index test mocking useFeature and returning object
  const minutesToSubtract = typeof minutes === 'number' ? minutes : 0;
  const displayTime = DateTime.fromISO(timeStamp, {
    locale: 'en-CA',
    zone: PACIFIC_TIME_ZONE,
  }).minus({ minutes: minutesToSubtract });
  return formatPacificDateTime(displayTime, 'MMMM dd, yyyy, tt ZZZZ');
};

export default dateTimeSubtracted;
