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
      if (value === 'Yes') value = true;
      if (value === 'No') value = false;

      onChange(value);
    },
  };
  return (
    <StyledContainer>
      {enumOptions &&
        enumOptions.map(
          (option: { value: string; label: string }, i: number) => {
            return (
              <StyledDiv key={option.value}>
                <RadioButton
                  {...formProps}
                  value={option.value}
                  id={`${id}-${i}`}
                  checked={option.value === value}
                  required={required}
                />
                <label>{option.label}</label>
              </StyledDiv>
            );
          }
        )}
    </StyledContainer>
  );
};

export default RadioWidget;
