import { WidgetProps } from '@rjsf/utils';

const BooleanWidget: React.FC<WidgetProps> = ({ value }) => {
  let displayValue;
  if (value !== undefined && value !== null)
    displayValue = value ? 'Yes' : 'No';

  return <>{displayValue}</>;
};

export default BooleanWidget;
