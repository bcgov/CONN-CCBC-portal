import { WidgetProps } from '@rjsf/core';
import RadioButton from '@button-inc/bcgov-theme/RadioButton';
import styled from 'styled-components';
import React from 'react';

const StyledRadioButton = styled(RadioButton)`
  margin: 12px 0;
`;

const RadioWidget: React.FC<WidgetProps> = ({
  onChange,
  id,
  value,
  required,
  options,
}) => {
  const { enumOptions }: any = options;
  const formProps = {
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      let value: string | boolean = e.target.value;
      if (value === '') value = '';
      if (value === 'true') value = true;
      if (value === 'false') value = false;
      onChange(value);
    },
  };
  return (
    <>
      {enumOptions &&
        enumOptions.map(
          (option: { value: string; label: string }, i: number) => {
            return (
              <StyledRadioButton
                key={option.value}
                {...formProps}
                label={option.label}
                value={option.value}
                id={`${id}-${i}`}
                checked={option.value === value}
                required={required}
              />
            );
          }
        )}
    </>
  );
};

export default RadioWidget;
