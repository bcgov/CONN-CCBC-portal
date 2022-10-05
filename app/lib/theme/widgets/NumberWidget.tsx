import { WidgetProps } from '@rjsf/core';
import styled from 'styled-components';
import CurrencyInput from 'react-currency-input-field';
import { Label } from '../../../components/Form';

const StyledFormattedNumbersInput = styled(CurrencyInput)`
  margin-top: 12px;
  margin-bottom: 4px;
  width: 50%;
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

const StyledMessage = styled('div')`
  display: flex;
  &::after {
    content: '.';
    visibility: hidden;
  }
`;

const NumberWidget: React.FC<WidgetProps> = ({
  id,
  disabled,
  placeholder,
  onChange,
  label,
  value,
  required,
  schema,
  uiSchema,
}) => {
  const help = uiSchema['ui:help'];

  // Check types to make react-currency-input-field happy
  const decimals =
    typeof uiSchema['ui:options']?.decimals === 'number'
      ? uiSchema['ui:options']?.decimals
      : 0;

  const handleChange = (value: string) => {
    const numberValue = Number(value);
    if (Number.isNaN(numberValue)) {
      onChange(null);
      return;
    }

    if (schema.maximum !== undefined && numberValue > schema.maximum) {
      onChange(schema.maximum);
      return;
    }

    // send the string value instead of the number so that the period isn't lost when typing a number
    // an input that keeps an internal state and doesn't trigger onChange when typing a number would allow us to
    // call onChange with a number instead of a string
    onChange(value);
  };

  return (
    <StyledDiv>
      <StyledFormattedNumbersInput
        allowDecimals={decimals !== 0}
        id={id}
        data-testid={id}
        disabled={disabled}
        defaultValue={value ?? ''}
        allowNegativeValue={false}
        decimalsLimit={decimals || 2}
        onValueChange={handleChange}
        required={required}
        aria-label={label}
        placeholder={placeholder}
        value={value ?? ''}
      />
      <StyledMessage>{help && <Label>{help}</Label>}</StyledMessage>
    </StyledDiv>
  );
};

export default NumberWidget;
