import styled from 'styled-components';
import { WidgetProps } from '@rjsf/core';
import { StyledValue } from './ReadOnlyWidget';

interface StatusProps {
  statusType: string;
}
const StyledStatus = styled.div<StatusProps>`
  border-radius: 4px;
  padding: 4px 16px;
  color: ${(props) => props.theme.color.white};
  background-color: ${(props) =>
    props.statusType === 'approved'
      ? props.theme.color.success
      : props.theme.color.primaryBlue};
  width: fit-content;
`;

const ReadOnlyStatusWidget: React.FC<WidgetProps> = ({ value }) => {
  return (
    <StyledValue>
      {value ? (
        <StyledStatus statusType="approved">
          Conditionally approved
        </StyledStatus>
      ) : (
        <StyledStatus statusType="received">Received</StyledStatus>
      )}
    </StyledValue>
  );
};

export default ReadOnlyStatusWidget;
