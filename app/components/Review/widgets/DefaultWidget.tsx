import { WidgetProps } from '@rjsf/utils';

const DefaultWidget: React.FC<WidgetProps> = ({ value }) => (
  <>{value?.toString()}</>
);

export default DefaultWidget;
