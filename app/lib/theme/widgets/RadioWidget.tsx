// @ts-nocheck
import { WidgetProps } from '@rjsf/core';
import RadioButton from '@button-inc/bcgov-theme/RadioButton';

const RadioWidget: React.FC<WidgetProps> = ({
  id,
  onChange,
  label,
  value,
  required,
  options,
}) => {
  const { enumOptions = [] } = options;
  console.log(enumOptions);
  const formProps = {
    onChange: (e) => {
      let value = e.target['value'];
      if (value === '') value = undefined;
      if (value === 'true') value = true;
      if (value === 'false') value = false;
      onChange(value);
    },
  };
  return (
    <div>
      {enumOptions &&
        enumOptions.map((option) => {
          return (
            <RadioButton
              key={option.value}
              {...formProps}
              label={option.label}
              value={option.value}
              checked={option.value === value}
              required={required}
            />
          );
        })}
    </div>
  );
};

export default RadioWidget;
