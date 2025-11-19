import { WidgetProps } from '@rjsf/utils';
import { StyledValue } from './ReadOnlyWidget';

const formatDecisionValue = (value?: string | null) => {
  if (!value) {
    return 'No decision received';
  }

  if (value === 'No decision') {
    return 'No decision received';
  }

  return value;
};

const ReadOnlyDecisionWidget: React.FC<WidgetProps> = ({ value }) => (
  <StyledValue data-testid="read-only-decision-widget">
    {formatDecisionValue(value as string)}
  </StyledValue>
);

export default ReadOnlyDecisionWidget;
