import defaultTheme from 'lib/theme/DefaultTheme';
import { forwardRef, useMemo } from 'react';
import { FormProps, AjvError, withTheme, ThemeProps } from '@rjsf/core';
import { customTransformErrors } from 'lib/theme/customTransformErrors';
import {
  customFormats,
  customFormatsErrorMessages,
} from 'data/jsonSchemaForm/customFormats';

interface FormPropsWithTheme<T> extends FormProps<T> {
  theme?: ThemeProps;
}

const FormBase: React.ForwardRefRenderFunction<
  object,
  FormPropsWithTheme<object>
> = (props, ref) => {
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
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      ref={ref}
      customFormats={customFormats}
      transformErrors={transformErrors}
      noHtml5Validate
      omitExtraData
      showErrorList={false}
    />
  );
};

export default forwardRef(FormBase);
