import { WidgetProps } from '@rjsf/utils';

const DateWidget: React.FC<WidgetProps> = ({ value }) => {
  const date = value?.toString().split('T')[0];
  return <>{date}</>;
};

export default DateWidget;
