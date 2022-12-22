import styled from 'styled-components';
import statusStyles from 'data/statusStyles';

interface Props {
  status: string;
}

interface StatusPillProps {
  statusStyles: {
    primary: string;
    backgroundColor: string;
    pillWidth: string;
    description: string;
  };
}

const StyledStatusPill = styled.div<StatusPillProps>`
  color: ${(props) => props.statusStyles?.primary};
  background-color: ${(props) => props.statusStyles?.backgroundColor};
  border: none;
  border-radius: 16px;
  padding: 4px 12px;
  white-space: nowrap;
  width: fit-content;
`;

const StatusPill: React.FC<Props> = ({ status }) => {
  const pillStyles = statusStyles[status];
  return (
    <StyledStatusPill statusStyles={pillStyles}>
      {pillStyles.description}
    </StyledStatusPill>
  );
};

export default StatusPill;
