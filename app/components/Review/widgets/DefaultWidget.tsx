import { WidgetProps } from '@rjsf/core';

const DefaultWidget: React.FC<WidgetProps> = ({ value }) => (
  <>{value?.toString()}</>
);

export default DefaultWidget;
