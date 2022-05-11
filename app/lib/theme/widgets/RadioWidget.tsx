// @ts-nocheck
import { WidgetProps } from '@rjsf/core';
import RadioButton from '@button-inc/bcgov-theme/RadioButton';
import styled from 'styled-components';

const StyledRadioButton = styled(RadioButton)`
  margin: 12px 0;
`;

const RadioWidget: React.FC<WidgetProps> = ({
  id,
  onChange,
  label,
  value,
  required,
  options,
}) => {
  const { enumOptions = [] } = options;
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
            <StyledRadioButton
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
