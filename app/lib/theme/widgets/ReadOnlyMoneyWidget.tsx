import { WidgetProps } from '@rjsf/utils';
import styled from 'styled-components';
import CurrencyInput from 'react-currency-input-field';
import Label from 'components/Form/Label';

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
  display: inline-block;
  margin-top: 8px;
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
  id,
  label,
  onChange,
  placeholder,
  required,
  value,
  options,
}) => {
  const decimals = (options?.decimals as number) ?? 2;
  const formattedValue =
    typeof value === 'number' ? Number(value.toFixed(decimals)) : value || 0;

  return (
    <StyledContainer>
      <StyledValue
        prefix="$"
        id={id}
        data-testid={id}
        style={{ outline: error && '4px solid #E71F1F' }}
        defaultValue={value || undefined}
        allowNegativeValue={false}
        maxLength={14}
        decimalsLimit={decimals}
        onValueChange={(val: any) => onChange(val || undefined)}
        required={required}
        aria-label={label}
        placeholder={placeholder}
        value={formattedValue}
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
