import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

interface Props {
  status: string;
  styles: any;
}

interface StatusPillProps {
  styles: {
    border?: string;
    primary: string;
    backgroundColor: string;
    pillWidth?: string;
    description: string;
  };
}

const StyledFontAwesome = styled(FontAwesomeIcon)`
  margin-right: 4px;
`;

const StyledStatusPill = styled.div<StatusPillProps>`
  color: ${(props) => props.styles?.primary};
  background-color: ${(props) => props.styles?.backgroundColor};
  border: ${(props) => props.styles?.border || 'none'};
  border-radius: 16px;
  padding: 4px 12px;
  white-space: nowrap;
  width: fit-content;
`;

const StatusPill: React.FC<Props> = ({ status, styles }) => {
  const pillStyles = styles[status];
  const isComplete = status === 'Complete';

  return (
    <StyledStatusPill styles={pillStyles}>
      {isComplete && <StyledFontAwesome icon={faCheck} fixedWidth size="sm" />}
      {pillStyles?.description || status}
    </StyledStatusPill>
  );
};

export default StatusPill;
