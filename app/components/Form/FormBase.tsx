import defaultTheme from 'lib/theme/DefaultTheme';
import { useMemo } from 'react';
import { FormProps, ThemeProps, withTheme } from '@rjsf/core';
import { customizeValidator } from '@rjsf/validator-ajv8';
import customTransformErrors from 'lib/theme/customTransformErrors';
import {
  customFormats,
  customFormatsErrorMessages,
} from 'data/jsonSchemaForm/customFormats';
import { RJSFValidationError } from '@rjsf/utils';

interface FormPropsWithTheme<T> extends FormProps<T> {
  theme?: ThemeProps;
}

const FormBase: React.FC<FormPropsWithTheme<any>> = (props) => {
  const { theme, formData, omitExtraData, transformErrors } = props;
  const ThemedForm = useMemo(() => withTheme(theme ?? defaultTheme), [theme]);

  const customTransform = (errors: RJSFValidationError[]) => {
    return customTransformErrors(errors, customFormatsErrorMessages);
  };

  const validator = customizeValidator({ customFormats });

  return (
    <ThemedForm
      // https://github.com/rjsf-team/react-jsonschema-form/pull/4085
      experimental_defaultFormStateBehavior={{
        emptyObjectFields: 'skipEmptyDefaults',
      }}
      {...props}
      // Always pass a form data, at least an empty object to prevent
      // onChange to be triggered on render when the page changes, which has associated bugs
      // e.g. (fixed in v5) https://github.com/rjsf-team/react-jsonschema-form/issues/1708
      formData={formData ?? {}}
      transformErrors={transformErrors || customTransform}
      noHtml5Validate
      omitExtraData={omitExtraData ?? true}
      showErrorList={false}
      validator={validator}
    />
  );
};

export default FormBase;
