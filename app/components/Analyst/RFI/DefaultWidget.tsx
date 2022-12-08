import { WidgetProps } from '@rjsf/core';
import styled from 'styled-components';

const StyledFlex = styled.div`
  display: flex;
`;

const StyledColumnLeft = styled.div`
  border-style: hidden;
  font-weight: 700;
  padding-top: 0;
  padding-bottom: 24px;
  min-width: 140px;
`;

const StyledColumnRight = styled.div`
  padding-top: 0;
`;

export const HiddenWidget = () => {
  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <></>;
};

const DefaultWidget: React.FC<WidgetProps> = ({ label, value }) => {
  const formattedValue = value?.toString().split(',').join(', ');

  return (
    <StyledFlex>
      <StyledColumnLeft>{label}</StyledColumnLeft>
      <StyledColumnRight>{formattedValue}</StyledColumnRight>
    </StyledFlex>
  );
};

export default DefaultWidget;
