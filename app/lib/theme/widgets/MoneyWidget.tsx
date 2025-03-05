import { WidgetProps } from '@rjsf/utils';
import styled from 'styled-components';
import CurrencyInput from 'react-currency-input-field';
import Label from 'components/Form/Label';

const StyledCurrencyInput = styled(CurrencyInput)`
  margin-top: 8px;
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
const hasInvalidFundingError = (val) => {
  return val === 'must be <= 0' || val === 'must be >= 0';
};

const MoneyWidget: React.FC<WidgetProps> = ({
  disabled,
  id,
  error,
  placeholder,
  onChange,
  label,
  value,
  required,
  uiSchema,
  formContext,
  name,
}) => {
  const help = uiSchema['ui:help'];
  let errorMessage = error;

  const { formErrorSchema } = formContext;
  const nestedFieldName = id?.split('_')?.[3];
  const index = id?.split('_')?.[2];

  const projectFundingErrors = formErrorSchema?.['projectFunding']?.[name]
    ?.__errors as Array<string>;

  const otherFundingSourcesError = formErrorSchema?.['otherFundingSources']?.[
    name
  ]?.__errors as Array<string>;

  const otherFundingSourcesArrayErrors = formErrorSchema?.[
    'otherFundingSources'
  ]?.['otherFundingSourcesArray']?.[index]?.[nestedFieldName]
    ?.__errors as Array<any>;

  if (
    projectFundingErrors?.find(hasInvalidFundingError) ||
    otherFundingSourcesError?.find(hasInvalidFundingError)
  ) {
    errorMessage = 'Invalid entry, must be 0 or empty';
  }

  if (otherFundingSourcesArrayErrors?.find(hasInvalidFundingError)) {
    errorMessage = 'Invalid entry, must be 0 or empty';
  }

  return (
    <StyledDiv>
      <StyledCurrencyInput
        id={id}
        data-testid={id}
        disabled={disabled}
        prefix="$"
        style={{ outline: error && '4px solid #E71F1F' }}
        defaultValue={value || undefined}
        allowNegativeValue={false}
        maxLength={14}
        decimalsLimit={2}
        onValueChange={(val: any) => onChange(val || 0)}
        required={required}
        aria-label={label}
        placeholder={placeholder}
        value={value || value === 0 ? value : ''}
      />
      <StyledMessage>
        {errorMessage && <StyledError>{errorMessage}</StyledError>}

        {help && <Label>{help}</Label>}
      </StyledMessage>
    </StyledDiv>
  );
};

export default MoneyWidget;
