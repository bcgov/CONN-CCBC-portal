import defaultTheme from 'lib/theme/DefaultTheme';
import { useMemo } from 'react';
import { FormProps, AjvError, withTheme, ThemeProps } from '@rjsf/core';
import { customTransformErrors } from 'lib/theme/customTransformErrors';
import {
  customFormats,
  customFormatsErrorMessages,
} from 'data/jsonSchemaForm/customFormats';

interface FormPropsWithTheme<T> extends FormProps<T> {
  theme?: ThemeProps;
}

const FormBase: React.FC<FormPropsWithTheme<any>> = (props) => {
  const Form = useMemo(
    () => withTheme(props.theme ?? defaultTheme),
    [props.theme]
  );

  const transformErrors = (errors: AjvError[]) => {
    return customTransformErrors(errors, customFormatsErrorMessages);
  };

  return (
    <Form
      {...props}
      customFormats={customFormats}
      transformErrors={transformErrors}
      noHtml5Validate
      omitExtraData
      showErrorList={false}
    />
  );
};

export default FormBase;
