import { WidgetProps } from '@rjsf/core';
import { StyledValue } from './ReadOnlyWidget';

const ReadOnlyResponseWidget: React.FC<WidgetProps> = ({ value }) => (
  <StyledValue>{value || 'No response'}</StyledValue>
);

export default ReadOnlyResponseWidget;
