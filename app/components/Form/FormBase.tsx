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

const Form = withTheme(formTheme);
const FormBase: React.ForwardRefRenderFunction<
  object,
  FormPropsWithTheme<object>
> = (props, ref) => {
  const transformErrors = (errors: AjvError[]) => {
    return customTransformErrors(errors, customFormatsErrorMessages);
  };

  const isSavedForm = props.formData
    ? Object.keys(props.formData).length
    : false;
  return (
    <Form
      {...props}
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      ref={ref}
      formData={isSavedForm && props.formData}
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
