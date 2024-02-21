import { useState } from 'react';
import { WidgetProps } from '@rjsf/core';
import Input from '@button-inc/bcgov-theme/Input';
import styled from 'styled-components';
import Label from 'components/Form/Label';
import NumberWidget from './NumberWidget';

const INPUT_MAX_LENGTH = 32000;

const StyledInput = styled(Input)`
  & input {
    margin-top: 8px;
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
  display: inline-block;
  margin-top: 8px;
`;

const StyledMessage = styled('div')`
  display: flex;
  flex-direction: column;
  &::after {
    content: '.';
    visibility: hidden;
  }
`;

const TextWidget: React.FC<WidgetProps> = (props) => {
  const {
    id,
    placeholder,
    disabled,
    onChange,
    label,
    options,
    value,
    required,
    schema,
    uiSchema,
  } = props;
  const [error, setError] = useState('');

  const [characterCount, setCharacterCount] = useState(
    value ? value.length : 0
  );

  // There is no NumberWidget by default in rjsf, so NumberField renders a TextWidget
  // This allows us to default to a NumberWidget without specifying it in the uiSchema for every number
  if (schema.type === 'number') return <NumberWidget {...props} />;

  const help = uiSchema['ui:help'];

  // Check types to make react-currency-input-field happy
  const maxLength =
    parseInt(String(uiSchema['ui:options']?.maxLength), 10) || INPUT_MAX_LENGTH;
  const showCharacterCount =
    uiSchema['ui:options']?.showCharacterCount ?? false;
  const minLength =
    typeof uiSchema['ui:options']?.minLength === 'number'
      ? uiSchema['ui:options']?.minLength
      : undefined;

  const inputType = options?.inputType;

  // https://owasp.org/www-community/OWASP_Validation_Regex_Repository
  const emailRegex =
    /^[a-zA-Z0-9_+&*-]+(?:\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,7}$/;

  const checkValidations = (onChangeFunction: any, val: any) => {
    if (inputType === 'email') {
      if (val && !emailRegex.test(val)) {
        setError('Please enter a valid email address');
      } else {
        setError('');
      }
      onChangeFunction(val || undefined);
    } else {
      onChangeFunction(val || undefined);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inputValue = e.target.value;
    checkValidations(onChange, inputValue);
    setCharacterCount(inputValue.length);
  };

  return (
    <StyledDiv>
      <StyledInput
        error={error}
        type="text"
        id={id}
        disabled={disabled}
        data-testid={id}
        onChange={handleInputChange}
        placeholder={placeholder}
        value={value ?? ''}
        min={0}
        size="medium"
        required={required}
        aria-label={label}
        maxLength={maxLength}
        minLength={minLength}
      />
      <StyledMessage>
        {error && <StyledError>{error}</StyledError>}
        {showCharacterCount && (
          <Label>{maxLength - characterCount} characters remaining</Label>
        )}
        {help && <Label>{help}</Label>}
      </StyledMessage>
    </StyledDiv>
  );
};

export default TextWidget;
