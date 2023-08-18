import { WidgetProps } from '@rjsf/core';
import styled from 'styled-components';

const StyledError = styled.div`
  color: ${({ theme }) => theme.color.error};
  margin: 8px 0;

  ${(props) => props.theme.breakpoint.largeUp} {
    margin: 0;
  }

  &:after {
    content: ' ‎ ';
  }
`;

const ErrorWidget: React.FC<WidgetProps> = ({ formContext }) => {
  const error = formContext?.contextErrorWidgetMessage;

  return <StyledError>{error}</StyledError>;
};

export default ErrorWidget;
