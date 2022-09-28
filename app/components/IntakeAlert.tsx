import Alert from '@button-inc/bcgov-theme/Alert';
import styled from 'styled-components';
import { DateTime } from 'luxon';

const StyledAlert = styled(Alert)`
  margin-bottom: 20px;
  p {
    margin: 0 0.5em;
  }
`;

interface Props {
  openTimestamp: string;
}

const IntakeAlert: React.FC<Props> = ({ openTimestamp }) => {
  if (!openTimestamp) return;

  const openDay = DateTime.fromISO(openTimestamp).toLocaleString(
    DateTime.DATE_FULL
  );

  return (
    <StyledAlert size="small" variant="warning">
      <p>
        New applications will be accepted after updates to ISED&lsquo;s
        Eligibility Mapping tool are released.
      </p>
      <p>
        Please check this page after <b>{openDay}</b> for an update.
      </p>
    </StyledAlert>
  );
};

export default IntakeAlert;
