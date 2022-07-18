import { useState } from 'react';
import { WidgetProps } from '@rjsf/core';
import { Label } from '../../../components/Form';
import Input from '@button-inc/bcgov-theme/Input';
import styled from 'styled-components';
import CurrencyInput from 'react-currency-input-field';
import formatPhone from '../../../utils/formatPhone';

const StyledInput = styled(Input)`
  & input {
    margin-top: 12px;
    margin-bottom: 4px;
    width: ${(props) => props.theme.width.inputWidthSmall};
  }
  & input: focus {
    outline: ${(props) =>
      props.error ? '4px solid #E71F1F' : '4px solid #3B99FC'}
`;

const StyledFormattedNumbersInput = styled(CurrencyInput)`
  margin-top: 12px;
  margin-bottom: 4px;
  width: ${(props) => props.theme.width.inputWidthSmall};
  border: 2px solid #606060;
  border-radius: 0;
  padding: 0.5em 0.6em;
  font-size: 1rem;
  border-radius: 0.25em;

  &:focus {
    outline: 4px solid #3b99fc;
    outline-offset: 1px;
  }
`;

const StyledDiv = styled('div')`
  margin-bottom: 8px;
`;

const StyledError = styled('div')`
  color: #e71f1f;
`;

const StyledMessage = styled('div')`
  display: flex;
  &::after {
    content: '.';
    visibility: hidden;
  }
`;

const TextWidget: React.FC<WidgetProps> = ({
  id,
  placeholder,
  onChange,
  label,
  options,
  value,
  required,
  schema,
  uiSchema,
}) => {
  const [error, setError] = useState('');
  const description = uiSchema['ui:description'];

  // Check types to make react-currency-input-field happy
  const maxLength =
    typeof uiSchema['ui:options']?.maxLength === 'number'
      ? uiSchema['ui:options']?.maxLength
      : false;
  const minLength =
    typeof uiSchema['ui:options']?.minLength === 'number'
      ? uiSchema['ui:options']?.minLength
      : false;

  const decimals =
    typeof uiSchema['ui:options']?.decimals === 'number'
      ? uiSchema['ui:options']?.decimals
      : false;

  const inputType = options?.inputType;
  const isNumber = schema?.type === 'number';

  const useFormattedNumbersInput =
    inputType === 'money' || inputType === 'commaMask';

  const usePhoneInput = inputType === 'phone';

  const wholeNumRegex = /^[\d]*$/;
  const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

  const checkValidations = (onChange: any, value: any) => {
    if (inputType === 'wholeNumber') {
      if (wholeNumRegex.test(value) || !value) {
        setError('');
        onChange(value || undefined);
      } else {
        setError('Please enter a valid number');
      }
    } else if (inputType === 'email') {
      if (value && !emailRegex.test(value)) {
        setError('Please enter a valid email address');
      } else {
        setError('');
      }
      onChange(value || undefined);
    } else if (inputType === 'phone') {
      const format = formatPhone(value);
      onChange(format);
    } else {
      onChange(value);
    }
  };

  return (
    <StyledDiv>
      {!useFormattedNumbersInput && (
        <StyledInput
          error={error}
          type={isNumber ? 'number' : 'text'}
          id={id}
          onChange={(e: { target: { value: string } }) => {
            const value = e.target.value;
            checkValidations(onChange, value);
          }}
          placeholder={placeholder}
          value={value || undefined}
          min={0}
          size={'medium'}
          required={required}
          aria-label={label}
          maxLength={usePhoneInput ? 12 : maxLength}
          minLength={minLength}
        />
      )}
      {useFormattedNumbersInput && (
        // Using react-currency-input-field to format not only money but numbers with commas as well
        // as specific decimal limit requirements
        <StyledFormattedNumbersInput
          allowDecimals={decimals === 0 ? false : true}
          id={id}
          prefix={inputType === 'money' ? '$' : ''}
          style={{ outline: error && '4px solid #E71F1F' }}
          defaultValue={value || undefined}
          allowNegativeValue={false}
          maxLength={maxLength || 14}
          decimalsLimit={decimals || 2}
          onValueChange={(value: any) => onChange(value || undefined)}
          required={required}
          aria-label={label}
          placeholder={placeholder}
          value={value || ''}
        />
      )}

      <StyledMessage>
        {error && <StyledError>{error}</StyledError>}

        {description && <Label>{description}</Label>}
      </StyledMessage>
    </StyledDiv>
  );
};

export default TextWidget;
