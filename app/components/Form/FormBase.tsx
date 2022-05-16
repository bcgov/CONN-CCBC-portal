import formTheme from '../../lib/theme/FormWithTheme';
import { forwardRef } from 'react';
import { FormProps, AjvError, withTheme } from '@rjsf/core';
import { customTransformErrors } from '../../lib/theme/customTransformErrors';
import {
  customFormats,
  customFormatsErrorMessages,
} from '../../data/jsonSchemaForm/customFormats';

interface FormPropsWithTheme<T> extends FormProps<T> {
  theme?: object;
  onSubmit: any;
  formData: any;
}

const FormBase: React.ForwardRefRenderFunction<
  object,
  FormPropsWithTheme<object>
> = (props, ref) => {
  const Form = withTheme(formTheme);
  const transformErrors = (errors: AjvError[]) => {
    return customTransformErrors(errors, customFormatsErrorMessages);
  };

  return (
    <Form
      {...props}
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      ref={ref}
      formData={JSON.parse(props.formData)}
      customFormats={customFormats}
      transformErrors={transformErrors}
      noHtml5Validate
      omitExtraData
      showErrorList={false}
      tagName={props.tagName}
    />
  );
};

export default forwardRef(FormBase);
