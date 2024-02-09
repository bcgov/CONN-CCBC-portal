import { WidgetProps } from '@rjsf/utils';
import formatMoney from 'utils/formatMoney';
import { StyledValue } from './ReadOnlyWidget';

const ReadOnlyRequestedMoneyWidget: React.FC<WidgetProps> = ({ value }) => (
  <StyledValue data-testid="read-only-requested-money-widget">
    {value ? `${formatMoney(value)} requested` : null}
  </StyledValue>
);

export default ReadOnlyRequestedMoneyWidget;
