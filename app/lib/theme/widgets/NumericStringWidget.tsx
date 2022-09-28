import { useState } from 'react';
import { WidgetProps } from '@rjsf/core';
import { Label } from '../../../components/Form';
import Input from '@button-inc/bcgov-theme/Input';
import styled from 'styled-components';
import formatPhone from '../../../utils/formatPhone';

const StyledInput = styled(Input)`
  & input {
    margin-top: 12px;
    margin-bottom: 4px;
    width: 50%;
  }
  & input: focus {
    outline: ${(props) =>
      props.error ? '4px solid #E71F1F' : '4px solid #3B99FC'}
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

const NumericStringWidget: React.FC<WidgetProps> = ({
  id,
  disabled,
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

  const { maxLength, minLength } = schema;
  const inputType = options?.inputType;

  const isPhone = inputType === 'phone';
  const wholeNumRegex = /^[0-9]+$/;

  const handleChange = (value: string) => {
    if (inputType === 'phone') {
      const format = formatPhone(value);
      onChange(format);
    } else {
      if (!value || wholeNumRegex.test(value)) {
        setError('');
        onChange(value?.slice(0, maxLength));
      } else {
        setError('Please enter a valid number');
      }
    }
  };

  return (
    <StyledDiv>
      <StyledInput
        error={error}
        type="text"
        id={id}
        onChange={(e: { target: { value: string } }) => {
          const value = e.target.value;
          handleChange(value);
        }}
        disabled={disabled}
        placeholder={placeholder}
        value={value ?? ''}
        size={'medium'}
        required={required}
        aria-label={label}
        maxLength={isPhone ? 12 : maxLength}
        minLength={minLength}
      />

      <StyledMessage>
        {error && <StyledError>{error}</StyledError>}

        {description && <Label>{description}</Label>}
      </StyledMessage>
    </StyledDiv>
  );
};

export default NumericStringWidget;
