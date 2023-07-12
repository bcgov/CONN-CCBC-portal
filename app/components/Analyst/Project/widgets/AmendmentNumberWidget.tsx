import { useEffect, useState } from 'react';
import { WidgetProps } from '@rjsf/core';
import { Div, Error, Input } from 'lib/theme/sharedWidgetStyles';

const AmendmentNumberWidget: React.FC<WidgetProps> = ({
  id,
  placeholder,
  disabled,
  formContext,
  rawErrors,
  onChange,
  label,
  value,
  required,
}) => {
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (rawErrors && rawErrors.length > 0) {
      setIsError(true);
    }
  }, [rawErrors]);

  const handleChange = (e) => {
    const { amendmentNumbers } = formContext;
    if (amendmentNumbers.includes(e.target.value)) {
      setIsError(false);
    } else {
      setIsError(true);
    }
    onChange(e.target.value.replace(/\D/g, ''));
  };

  return (
    <Div>
      <Input
        type="text"
        isError={isError}
        id={id}
        disabled={disabled}
        data-testid={id}
        onChange={handleChange}
        placeholder={placeholder}
        value={value ?? ''}
        size="medium"
        required={required}
        aria-label={label}
      />
      <Error isError={isError}>
        {isError ? 'Amendment number already in use' : '‎'}
      </Error>
    </Div>
  );
};

export default AmendmentNumberWidget;
