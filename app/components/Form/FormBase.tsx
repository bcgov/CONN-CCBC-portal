import defaultTheme from 'lib/theme/DefaultTheme';
import { useMemo } from 'react';
import { FormProps, AjvError, withTheme, ThemeProps } from '@rjsf/core';
import customTransformErrors from 'lib/theme/customTransformErrors';
import {
  customFormats,
  customFormatsErrorMessages,
} from 'data/jsonSchemaForm/customFormats';

interface FormPropsWithTheme<T> extends FormProps<T> {
  theme?: ThemeProps;
}

const FormBase: React.FC<FormPropsWithTheme<any>> = (props) => {
  const { theme, formData } = props;
  const Form = useMemo(() => withTheme(theme ?? defaultTheme), [theme]);

  const transformErrors = (errors: AjvError[]) => {
    return customTransformErrors(errors, customFormatsErrorMessages);
  };

  return (
    <Form
      {...props}
      // Always pass a form data, at least an empty object to prevent
      // onChange to be triggered on render when the page changes, which has associated bugs
      // e.g. (fixed in v5) https://github.com/rjsf-team/react-jsonschema-form/issues/1708
      formData={formData ?? {}}
      customFormats={customFormats}
      transformErrors={transformErrors}
      noHtml5Validate
      omitExtraData
      showErrorList={false}
    />
  );
};

export default FormBase;
