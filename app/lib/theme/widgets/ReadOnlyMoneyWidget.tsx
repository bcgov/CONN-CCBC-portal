import { WidgetProps } from '@rjsf/core';
import { Label } from '../../../components/Form';
import styled from 'styled-components';
import CurrencyInput from 'react-currency-input-field';

const StyledContainer = styled('div')`
  margin-bottom: 8px;
`;

const StyledValue = styled(CurrencyInput)`
  margin-top: 12px;
  margin-bottom: 4px;
  width: 50%;
  padding: 0.5em 0.6em;
  font-weight: 700;
  white-space: nowrap;

  &:disabled {
    background: inherit;
    border: none;
  }
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

const ReadOnlyWidget: React.FC<WidgetProps> = ({
  error,
  description,
  label,
  onChange,
  placeholder,
  required,
  value,
}) => {
  return (
    <StyledContainer>
      <StyledValue
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
        value={value || 0}
        disabled
      />
      <StyledMessage>
        {error && <StyledError>{error}</StyledError>}

        {description && <Label>{description}</Label>}
      </StyledMessage>
    </StyledContainer>
  );
};

export default ReadOnlyWidget;
