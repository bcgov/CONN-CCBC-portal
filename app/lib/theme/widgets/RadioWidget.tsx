import { WidgetProps } from '@rjsf/core';
import RadioButton from '@button-inc/bcgov-theme/RadioButton';

const RadioWidget: React.FC<WidgetProps> = ({
  id,
  onChange,
  label,
  value,
  required,
}) => {
  return (
    <div>
      <RadioButton
        id={id}
        onChange={(e: { target: { value: boolean } }) => {
          onChange(e.target.value);
        }}
        required={required}
      />
    </div>
  );
};

export default RadioWidget;
