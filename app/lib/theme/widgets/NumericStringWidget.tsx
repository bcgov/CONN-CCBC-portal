import { useState } from 'react';
import { WidgetProps } from '@rjsf/core';
import Input from '@button-inc/bcgov-theme/Input';
import styled from 'styled-components';
import Label from 'components/Form/Label';
import formatPhone from 'utils/formatPhone';

const StyledInput = styled(Input)`
  & input {
    margin-top: 8px;
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
  const help = uiSchema['ui:help'];

  const { maxLength, minLength } = schema;
  const inputType = options?.inputType;

  const isPhone = inputType === 'phone';
  const wholeNumRegex = /^[0-9]+$/;

  const handleChange = (val: string) => {
    if (inputType === 'phone') {
      const format = formatPhone(val);
      onChange(format);
    } else if (!val || wholeNumRegex.test(val)) {
      setError('');
      onChange(val?.slice(0, maxLength));
    } else {
      setError('Please enter a valid number');
    }
  };

  return (
    <StyledDiv>
      <StyledInput
        error={error}
        type="text"
        id={id}
        onChange={(e: { target: { value: string } }) => {
          const val = e.target.value;
          handleChange(val);
        }}
        disabled={disabled}
        placeholder={placeholder}
        value={value ?? ''}
        size="medium"
        required={required}
        aria-label={label}
        maxLength={isPhone ? 12 : maxLength}
        minLength={minLength}
      />

      <StyledMessage>
        {error && <StyledError>{error}</StyledError>}

        {help && <Label>{help}</Label>}
      </StyledMessage>
    </StyledDiv>
  );
};

export default NumericStringWidget;
