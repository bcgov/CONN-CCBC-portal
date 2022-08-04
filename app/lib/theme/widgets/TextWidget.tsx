import { useState } from 'react';
import { WidgetProps } from '@rjsf/core';
import { Label } from '../../../components/Form';
import Input from '@button-inc/bcgov-theme/Input';
import styled from 'styled-components';

const StyledInput = styled(Input)`
  & input {
    margin-top: 12px;
    margin-bottom: 4px;
    width: 50%;
  }
  &input: focus {
    outline: ${(props) =>
      props.error ? '4px solid #E71F1F' : '4px solid #3B99FC'};
  }
  input:disabled {
    background: rgba(196, 196, 196, 0.3);
    border: 1px solid rgba(96, 96, 96, 0.3);
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
  disabled,
  id,
  placeholder,
  disabled,
  onChange,
  label,
  options,
  value,
  required,
  uiSchema,
}) => {
  const [error, setError] = useState('');
  const description = uiSchema['ui:description'];

  // Check types to make react-currency-input-field happy
  const maxLength =
    typeof uiSchema['ui:options']?.maxLength === 'number'
      ? uiSchema['ui:options']?.maxLength
      : undefined;
  const minLength =
    typeof uiSchema['ui:options']?.minLength === 'number'
      ? uiSchema['ui:options']?.minLength
      : undefined;

  const inputType = options?.inputType;

  // https://owasp.org/www-community/OWASP_Validation_Regex_Repository
  const emailRegex =
    /^[a-zA-Z0-9_+&*-]+(?:\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,7}$/;

  const checkValidations = (onChange: any, value: any) => {
    if (inputType === 'email') {
      if (value && !emailRegex.test(value)) {
        setError('Please enter a valid email address');
      } else {
        setError('');
      }
      onChange(value || undefined);
    } else {
      onChange(value || undefined);
    }
  };

  return (
    <StyledDiv>
      <StyledInput
        error={error}
        type="text"
        id={id}
        disabled={disabled}
        data-testid={id}
        onChange={(e: { target: { value: string } }) => {
          const value = e.target.value;
          checkValidations(onChange, value);
        }}
        placeholder={placeholder}
        value={value || undefined}
        min={0}
        disabled={disabled}
        size={'medium'}
        required={required}
        aria-label={label}
        maxLength={maxLength}
        minLength={minLength}
      />
      <StyledMessage>
        {error && <StyledError>{error}</StyledError>}

        {description && <Label>{description}</Label>}
      </StyledMessage>
    </StyledDiv>
  );
};

export default TextWidget;
