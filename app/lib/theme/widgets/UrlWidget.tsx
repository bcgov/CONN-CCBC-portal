import { useEffect, useState } from 'react';
import { WidgetProps } from '@rjsf/utils';
import { Div, Error, Input } from 'lib/theme/sharedWidgetStyles';
import validator from 'validator';

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
    <Div className="url-widget-wrapper" {...({} as any)}>
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
      <Error isError={urlError} {...({} as any)}>
        {urlError
          ? 'Invalid URL. Please copy and paste from your browser.'
          : '‎'}
      </Error>
    </Div>
  );
};

export default UrlWidget;
