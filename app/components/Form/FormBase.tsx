import formTheme from '../../lib/theme/FormWithTheme';
import { forwardRef } from 'react';
import { FormProps, AjvError, withTheme } from '@rjsf/core';
import { customTransformErrors } from '../../lib/theme/customTransformErrors';
import {
  customFormats,
  customFormatsErrorMessages,
} from '../../data/jsonSchemaForm/customFormats';

interface FormPropsWithTheme<T> extends FormProps<T> {
  theme?: any;
}

const FormBase: React.ForwardRefRenderFunction<any, FormPropsWithTheme<any>> = (
  props,
  ref
) => {
  const Form = withTheme(formTheme);
  const transformErrors = (errors: AjvError[]) => {
    return customTransformErrors(errors, customFormatsErrorMessages);
  };
  return (
    <Form
      {...props}
      // @ts-ignore
      ref={ref}
      customFormats={customFormats}
      transformErrors={transformErrors}
      noHtml5Validate
      omitExtraData
      showErrorList={false}
      tagName={props.tagName}
    ></Form>
  );
};

export default forwardRef(FormBase);
