import { WidgetProps } from '@rjsf/core';
import { StyledValue } from './ReadOnlyWidget';

const ReadOnlyDecisionWidget: React.FC<WidgetProps> = ({ value }) => (
  <StyledValue data-testid="read-only-decision-widget">
    {value || 'No decision received'}
  </StyledValue>
);

export default ReadOnlyDecisionWidget;
