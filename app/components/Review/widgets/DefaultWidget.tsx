import { WidgetProps } from '@rjsf/core';

const DefaultWidget: React.FC<WidgetProps> = ({ value }) => {
  return <>{value?.toString()}</>;
};

export default DefaultWidget;
