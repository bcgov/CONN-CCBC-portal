import { WidgetProps } from '@rjsf/utils';
import { StyledValue } from './ReadOnlyWidget';

const ReadOnlyResponseWidget: React.FC<WidgetProps> = ({ value }) => (
  <StyledValue data-testid="read-only-response-widget">
    {value || 'No response'}
  </StyledValue>
);

export default ReadOnlyResponseWidget;
