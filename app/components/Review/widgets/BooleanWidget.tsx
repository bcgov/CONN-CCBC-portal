import { WidgetProps } from '@rjsf/core';

const BooleanWidget: React.FC<WidgetProps> = ({ value }) => {
  let displayValue;
  if (value !== undefined && value !== null)
    displayValue = value ? 'Yes' : 'No';

  return <>{displayValue}</>;
};

export default BooleanWidget;
