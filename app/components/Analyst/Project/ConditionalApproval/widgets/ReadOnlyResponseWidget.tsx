import { WidgetProps } from '@rjsf/core';
import { StyledValue } from './ReadOnlyWidget';

const ReadOnlyResponseWidget: React.FC<WidgetProps> = ({ value }) => (
  <StyledValue data-testid="read-only-response-widget">
    {value || 'No response'}
  </StyledValue>
);

export default ReadOnlyResponseWidget;
