import { useEffect, useState } from 'react';
import { WidgetProps } from '@rjsf/utils';
import styled from 'styled-components';
import validator from 'validator';

interface DivProps {
  children?: React.ReactNode;
  className?: string;
}

const Div = styled.div<DivProps>`
  margin-bottom: 8px;
`;

interface ErrorProps {
  children?: React.ReactNode;
  isError?: boolean;
}

const Error = styled.div<ErrorProps>`
  color: #e71f1f;
  display: ${({ isError }) => (isError ? 'inline-block' : 'none')};
  margin-top: 8px;
`;

interface InputProps {
  type?: string;
  id?: string;
  disabled?: boolean;
  'data-testid'?: string;
  onChange?: (e: any) => void;
  placeholder?: string;
  value?: any;
  size?: string;
  required?: boolean;
  'aria-label'?: string;
  isError?: boolean;
}

const Input = styled.input<InputProps>`
  margin-top: 8px;
  margin-bottom: 4px;
  width: 50%;
  padding: 0.5em 0.6em;
  border: 1px solid rgba(0, 0, 0, 0.16);
  border-radius: 4px;

  &:focus {
    outline: ${({ isError }) =>
      isError ? '4px solid #E71F1F' : '4px solid #3B99FC'};
  }

  &:disabled {
    background: rgba(196, 196, 196, 0.3);
    border: 1px solid rgba(96, 96, 96, 0.3);
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

  const [urlError, setUrlError] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (rawErrors && rawErrors.length > 0) {
      setIsError(true);
    }
  }, [rawErrors]);

  const handleChange = (e) => {
    if (validator.isURL(e.target.value)) {
      setUrlError(false);
      setIsError(false);
    } else {
      setUrlError(true);
      setIsError(true);
    }
    onChange(e.target.value);
  };

  return (
    <Div className="url-widget-wrapper">
      <Input
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
      <Error isError={urlError}>
        {urlError
          ? 'Invalid URL. Please copy and paste from your browser.'
          : '‎'}
      </Error>
    </Div>
  );
};

export default UrlWidget;
