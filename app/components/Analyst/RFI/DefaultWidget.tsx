import { WidgetProps } from '@rjsf/core';
import styled from 'styled-components';

const StyledTR = styled.tr`
  border-style: hidden;
`;

const StyledTdLeft = styled.td`
  border-style: hidden;
  font-weight: 700;
`;

const StyledTdRight = styled.td`
  border-style: hidden;
  padding-left: 72px;
`;

const DefaultWidget: React.FC<WidgetProps> = ({ label, value }) => {
  return (
    <StyledTR>
      <StyledTdLeft>
        <b>{label}</b>
      </StyledTdLeft>
      <StyledTdRight>{value?.toString()}</StyledTdRight>
    </StyledTR>
  );
};

export default DefaultWidget;
