import { useState } from 'react';
import { WidgetProps } from '@rjsf/core';
import { Label } from '../../../components/Form';
import styled from 'styled-components';
import CurrencyInput from 'react-currency-input-field';

const StyledCurrencyInput = styled(CurrencyInput)`
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

const MoneyWidget: React.FC<WidgetProps> = ({
  id,
  placeholder,
  onChange,
  label,
  value,
  required,
  uiSchema,
}) => {
  const [error, setError] = useState('');
  const description = uiSchema['ui:description'];

  return (
    <StyledDiv>
      <StyledCurrencyInput
        id={id}
        data-testid={id}
        prefix="$"
        style={{ outline: error && '4px solid #E71F1F' }}
        defaultValue={value || undefined}
        allowNegativeValue={false}
        maxLength={14}
        decimalsLimit={2}
        onValueChange={(value: any) => onChange(value || undefined)}
        required={required}
        aria-label={label}
        placeholder={placeholder}
        value={value || ''}
      />
      <StyledMessage>
        {error && <StyledError>{error}</StyledError>}

        {description && <Label>{description}</Label>}
      </StyledMessage>
    </StyledDiv>
  );
};

export default MoneyWidget;
