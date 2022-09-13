import { WidgetProps } from '@rjsf/core';
import formatMoney from 'utils/formatMoney';

const MoneyWidget: React.FC<WidgetProps> = ({ value }) => {
  return <>{formatMoney(value)}</>;
};

export default MoneyWidget;
