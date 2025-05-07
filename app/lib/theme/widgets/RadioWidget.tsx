import { WidgetProps } from '@rjsf/utils';
import RadioButton from '@button-inc/bcgov-theme/RadioButton';
import styled from 'styled-components';
import React from 'react';

const StyledContainer = styled('div')`
  margin-top: 8px;
  margin-bottom: 16px;

  div:first-child {
    margin-top: 0px;
  }

  div {
    margin-bottom: 0px;
    margin-top: 8px;
    line-height: 8px;
  }

  label:focus-within {
    border-radius: 99px;
  }

  .pg-radio {
    margin-top: 0px;
    margin-bottom: 0px;
  }

  .pg-radio-label {
    padding-left: 1em;
  }
`;

const StyledDiv = styled('div')`
  margin: 16px 0;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const StyledLabel = styled.label`
  padding-left: 8px;
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
      if (choice === 'YES') choice = true;
      if (choice === 'NO') choice = false;
      if (choice === 'yes') choice = true;
      if (choice === 'no') choice = false;

      onChange(choice);
    },
  };
  return (
    <StyledContainer className="radio-widget">
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
            <StyledLabel htmlFor={`${id}-${i}`}>{option.label}</StyledLabel>
          </StyledDiv>
        )
      )}
    </StyledContainer>
  );
};

export default RadioWidget;
