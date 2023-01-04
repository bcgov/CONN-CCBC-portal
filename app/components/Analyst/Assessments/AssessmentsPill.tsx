import { StyledStatusPill } from 'components/AnalystDashboard/StatusPill';
import assessmentPillStyles from 'data/assessmentPillStyles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

interface Props {
  status: string;
}

const StatusPill: React.FC<Props> = ({ status }) => {
  const pillStyles = assessmentPillStyles[status];
  const isComplete = status === 'Complete';

  return (
    <StyledStatusPill statusStyles={pillStyles}>
      {isComplete && <FontAwesomeIcon icon={faCheck} fixedWidth />}
      {status}
    </StyledStatusPill>
  );
};

export default StatusPill;
