import { WidgetProps } from '@rjsf/core';
import styled from 'styled-components';

const StyledError = styled.div`
  color: ${({ theme }) => theme.color.error};
  margin-bottom: 8px;

  &:after {
    content: ' ‎ ';
  }
`;

const ErrorWidget: React.FC<WidgetProps> = ({ formContext }) => {
  const error = formContext?.contextErrorWidgetMessage;

  return <StyledError>{error}</StyledError>;
};

export default ErrorWidget;
