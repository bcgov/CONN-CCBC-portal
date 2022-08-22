import { FieldProps } from '@rjsf/core';
import { DateTime } from 'luxon';

const ReviewField: React.FC<FieldProps> = (props) => {
  const {
    formContext: { intakeCloseTimestamp },
  } = props;

  return (
    <>
      <p>
        Please ensure your responses are accurate. You may continue to edit your
        application after marking it as Ready for Assessment until the intake
        closes on{' '}
        {DateTime.fromISO(intakeCloseTimestamp, {
          locale: 'en-CA',
          zone: 'America/Vancouver',
        }).toLocaleString(DateTime.DATETIME_FULL)}
        .
      </p>
    </>
  );
};

export default ReviewField;
