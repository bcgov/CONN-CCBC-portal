import { useState } from 'react';
import { WidgetProps } from '@rjsf/core';
import Input from '@button-inc/bcgov-theme/Input';
import styled from 'styled-components';
import validator from 'validator';

interface ErrorProps {
  isError: boolean | string;
}

const StyledInput = styled(Input)`
  & input {
    margin-top: 12px;
    margin-bottom: 4px;
    min-width: 50%;
    border: ${(props) =>
      props.isError ? '2px solid #E71F1F' : '2px solid #606060'};
  }

  ${(props) => props.theme.breakpoint.largeUp} {
    & input {
      min-width: 240px;
    }
  }

  input: focus {
    outline: ${(props) =>
      props.isError ? '4px solid #E71F1F' : '4px solid #3B99FC'};
  }
  input:disabled {
    background: rgba(196, 196, 196, 0.3);
    border: 1px solid rgba(96, 96, 96, 0.3);
  }
`;

const StyledDiv = styled.div`
  position: relative;
  margin: 8px 0;
`;

const StyledError = styled.div<ErrorProps>`
  color: #e70f1f;
  max-height: ${(props) => (props.isError ? '20px' : '0px')};

  transition: max-height 0.5s ease-in-out;
  overflow: hidden;

  ${(props) => props.theme.breakpoint.largeUp} {
    position: absolute;
    max-height: 40px;
    white-space: nowrap;
    overflow: visible;
  }
`;

const UrlWidget: React.FC<WidgetProps> = (props) => {
  const {
    id,
    placeholder,
    disabled,
    rawErrors,
    onChange,
    label,
    value,
    required,
  } = props;

  const [urlError, setUrlError] = useState(value && validator.isURL(value));
  const isError = rawErrors && rawErrors.length > 0;

  const handleChange = (e) => {
    if (validator.isURL(e.target.value)) {
      setUrlError(false);
    } else {
      setUrlError(true);
    }
    onChange(e.target.value);
  };

  return (
    <StyledDiv>
      <StyledInput
        type="url"
        isError={isError || urlError}
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
      <StyledError isError={urlError}>
        {urlError
          ? 'Invalid URL. Please copy and paste from your browser'
          : '‎'}
      </StyledError>
    </StyledDiv>
  );
};

export default UrlWidget;
