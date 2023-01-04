import styled from 'styled-components';
import { StyledStatusPill } from 'components/AnalystDashboard/StatusPill';
import assessmentPillStyles from 'data/assessmentPillStyles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

interface Props {
  status: string;
}

const StyledFontAwesome = styled(FontAwesomeIcon)`
  margin-right: 4px;
`;

const StatusPill: React.FC<Props> = ({ status }) => {
  const pillStyles = assessmentPillStyles[status];
  const isComplete = status === 'Complete';

  return (
    <StyledStatusPill statusStyles={pillStyles}>
      {isComplete && <StyledFontAwesome icon={faCheck} fixedWidth size="sm" />}
      {status}
    </StyledStatusPill>
  );
};

export default StatusPill;
