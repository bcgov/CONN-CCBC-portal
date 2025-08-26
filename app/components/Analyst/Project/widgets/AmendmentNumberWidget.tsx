import { useEffect, useState } from 'react';
import { WidgetProps } from '@rjsf/utils';
import styled from 'styled-components';
import { Input } from '@button-inc/bcgov-theme';

interface ErrorProps {
  children?: React.ReactNode;
  isError: boolean;
  isInvalid?: boolean;
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
  visibility: ${({ isInvalid }) => (isInvalid ? 'visible' : 'hidden')};
  opacity: ${({ isInvalid }) => (isInvalid ? '1' : '0')};
  transition:
    opacity 0.3s,
    visibility 0.3s;
`;

const StyledInput = styled(Input)`
  & input {
    max-width: 54px;
    margin: 0px;
    border: ${(props) =>
      props.isError ? '2px solid #E71F1F' : '2px solid #606060'};
  }

  input:focus {
    outline: ${(props) =>
      props.isError ? '4px solid #E71F1F' : '4px solid #3B99FC'};
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
  const [isInvalid, setIsInvalid] = useState(false);

  useEffect(() => {
    if (rawErrors && rawErrors.length > 0) {
      setIsError(true);

      if (rawErrors.includes(`Can't be a duplicate amendment number`)) {
        setIsInvalid(true);
      }
    } else {
      setIsError(false);
      setIsInvalid(false);
    }
  }, [rawErrors]);

  const handleChange = (e) => {
    const { amendmentNumbers } = formContext;

    if (
      amendmentNumbers.split(' ').includes(e.target.value) &&
      parseInt(e.target.value, 10) !== formContext.currentAmendmentNumber
    ) {
      setIsError(true);
      setIsInvalid(true);
    } else {
      setIsError(false);
      setIsInvalid(false);
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
      <StyledError isError={isError} isInvalid={isInvalid}>
        Amendment number already in use
      </StyledError>
    </StyledContainer>
  );
};

export default AmendmentNumberWidget;
