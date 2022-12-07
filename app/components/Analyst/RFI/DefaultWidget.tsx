import { WidgetProps } from '@rjsf/core';
import styled from 'styled-components';

const StyledTR = styled.tr`
  border-style: hidden;
`;

const StyledTdLeft = styled.td`
  border-style: hidden;
  font-weight: 700;
  padding-top: 0;
  padding-bottom: 24px;
`;

const StyledTdRight = styled.td`
  border-style: hidden;
  padding-left: 72px;
  padding-top: 0;
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
