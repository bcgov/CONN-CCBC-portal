import { WidgetProps } from '@rjsf/core';
import styled from 'styled-components';
import Label from 'components/Form/Label';

const StyledContainer = styled('div')`
  margin-bottom: 8px;
`;

const StyledValue = styled('div')`
  margin-top: 12px;
  margin-bottom: 4px;
  width: 50%;
  padding: 0.5em 0.6em;
  font-weight: 700;
  white-space: nowrap;
`;

const StyledError = styled('div')`
  color: #e71f1f;
`;

const StyledMessage = styled('div')`
  display: flex;
  &::after {
    content: '.';
    visibility: hidden;
  }
`;

const ReadOnlyWidget: React.FC<WidgetProps> = ({
  error,
  description,
  value,
}) => (
  <StyledContainer>
    <StyledValue>{value}</StyledValue>
    <StyledMessage>
      {error && <StyledError>{error}</StyledError>}

      {description && <Label>{description}</Label>}
    </StyledMessage>
  </StyledContainer>
);

export default ReadOnlyWidget;
