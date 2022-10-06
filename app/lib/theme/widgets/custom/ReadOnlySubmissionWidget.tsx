import { WidgetProps } from '@rjsf/core';
import styled from 'styled-components';

export const StyledContainer = styled('div')`
  margin-bottom: 8px;
`;

export const StyledValue = styled('div')`
  margin-top: 12px;
  margin-bottom: 4px;
  padding: 0.6em 0;
`;

const ReadOnlySubmissionWidget: React.FC<WidgetProps> = ({ id, value }) => (
  <StyledContainer>
    <StyledValue id={id}>{value}</StyledValue>
  </StyledContainer>
);

export default ReadOnlySubmissionWidget;
