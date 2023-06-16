import { WidgetProps } from '@rjsf/core';
import RadioButton from '@button-inc/bcgov-theme/RadioButton';
import styled from 'styled-components';
import React from 'react';

const StyledContainer = styled('div')`
  margin-top: 16px;
  margin-bottom: 32px;
`;

const StyledDiv = styled('div')`
  margin: 16px 0;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const RadioWidget: React.FC<WidgetProps> = ({
  onChange,
  id,
  disabled,
  value,
  required,
  options,
}) => {
  const { enumOptions }: any = options;
  const formProps = {
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      let choice: string | boolean = e.target.value;
      if (choice === '') choice = '';
      if (choice === 'true') choice = true;
      if (choice === 'false') choice = false;
      if (choice === 'Yes') choice = true;
      if (choice === 'No') choice = false;

      onChange(choice);
    },
  };
  return (
    <StyledContainer>
      {enumOptions?.map(
        (option: { value: string; label: string }, i: number) => (
          <StyledDiv key={option.value} style={{ opacity: disabled && '0.6' }}>
            <RadioButton
              {...formProps}
              value={option.value}
              id={`${id}-${i}`}
              name={`${id}-${i}`}
              checked={option.value === value}
              required={required}
              disabled={disabled}
            />
            <label htmlFor={`${id}-${i}`}>{option.label}</label>
          </StyledDiv>
        )
      )}
    </StyledContainer>
  );
};

export default RadioWidget;
