import { useEffect, useState } from 'react';
import { WidgetProps } from '@rjsf/core';
import styled from 'styled-components';
import { Input } from '@button-inc/bcgov-theme';

interface ErrorProps {
  isError: boolean;
}

const StyledContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  align-items: center;
`;

const StyledError = styled.div<ErrorProps>`
  color: ${({ theme }) => theme.color.error};
  margin-left: 16px;
  visibility: ${({ isError }) => (isError ? 'visible' : 'hidden')};
  opacity: ${({ isError }) => (isError ? '1' : '0')};
  transition: opacity 0.3s, visibility 0.3s;
}`;

const StyledInput = styled(Input)`
  margin: 8px 0;

  input {
    max-width: 54px;
    margin: 0px;
  }
`;

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

    if (!amendmentNumbers.split(' ').includes(e.target.value)) {
      setIsError(false);
    } else {
      setIsError(true);
    }
    onChange(e.target.value.replace(/\D/g, ''));
  };

  return (
    <StyledContainer>
      <StyledInput
        style={{ width: '54px' }}
        type="text"
        isError={isError}
        id={id}
        disabled={disabled}
        data-testid={id}
        maxLength={3}
        onChange={handleChange}
        placeholder={placeholder}
        value={value ?? ''}
        size="medium"
        required={required}
        aria-label={label}
      />
      <StyledError isError={isError}>
        Amendment number already in use
      </StyledError>
    </StyledContainer>
  );
};

export default AmendmentNumberWidget;
