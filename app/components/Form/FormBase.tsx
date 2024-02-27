import defaultTheme from 'lib/theme/DefaultTheme';
import { useMemo } from 'react';
import { FormProps, ThemeProps, withTheme } from '@rjsf/core';
import { customizeValidator } from '@rjsf/validator-ajv8';
import customTransformErrors from 'lib/theme/customTransformErrors';
import {
  customFormats,
  customFormatsErrorMessages,
} from 'data/jsonSchemaForm/customFormats';
import { RJSFValidationError, ValidatorType } from '@rjsf/utils';

interface FormPropsWithTheme<T> extends Omit<FormProps<T>, 'validator'> {
  theme?: ThemeProps;
  // making the validator prop optional
  validator?: ValidatorType;
}

const FormBase: React.FC<FormPropsWithTheme<any>> = (props) => {
  const { theme, formData, omitExtraData, transformErrors, validator } = props;
  const ThemedForm = useMemo(() => withTheme(theme ?? defaultTheme), [theme]);

  const customTransform = (errors: RJSFValidationError[]) => {
    return customTransformErrors(errors, customFormatsErrorMessages);
  };

  const customValidator = customizeValidator({ customFormats });

  return (
    <ThemedForm
      {...props}
      // Always pass a form data, at least an empty object to prevent
      // onChange to be triggered on render when the page changes, which has associated bugs
      // e.g. (fixed in v5) https://github.com/rjsf-team/react-jsonschema-form/issues/1708
      formData={formData ?? {}}
      transformErrors={transformErrors || customTransform}
      noHtml5Validate
      omitExtraData={omitExtraData ?? true}
      showErrorList={false}
      validator={validator ?? customValidator}
    />
  );
};

export default FormBase;
