import defaultTheme from 'lib/theme/DefaultTheme';
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { FormProps, IChangeEvent, ThemeProps, withTheme } from '@rjsf/core';
import Ajv8Validator, { customizeValidator } from '@rjsf/validator-ajv8';
import customTransformErrors from 'lib/theme/customTransformErrors';
import {
  customFormats,
  customFormatsErrorMessages,
} from 'data/jsonSchemaForm/customFormats';
import { RJSFValidationError, ValidatorType } from '@rjsf/utils';
import { useUnsavedChanges } from 'components/UnsavedChangesProvider';
import getFormState from 'utils/getFormState';
import isEqual from 'lodash.isequal';

interface FormPropsWithTheme<T> extends Omit<FormProps<T>, 'validator'> {
  theme?: ThemeProps;
  // making the validator prop optional
  validator?: ValidatorType;
}

export interface FormBaseRef {
  resetFormState: (formData: any) => void;
}

const FormBase = forwardRef<FormBaseRef, FormPropsWithTheme<any>>(
  (props, ref) => {
    const {
      theme,
      formData,
      omitExtraData,
      transformErrors,
      validator,
      formContext,
      schema,
      onChange = () => {},
    } = props;

    const ThemedForm = useMemo(() => withTheme(theme ?? defaultTheme), [theme]);
    const [isFormTouched, setIsFormTouched] = useState(false);
    const initialFormData = useRef(null);

    const { updateDirtyState } = useUnsavedChanges();
    const customValidator = customizeValidator({ customFormats });
    const skipUnsavedWarning = formContext?.skipUnsavedWarning ?? false;

    useEffect(() => {
      if (initialFormData.current === null && formData) {
        initialFormData.current = getFormState(schema, formData, Ajv8Validator);
      }

      updateDirtyState(
        !isEqual(formData, initialFormData.current) &&
          !skipUnsavedWarning &&
          isFormTouched
      );
    }, [formData, isFormTouched, skipUnsavedWarning, updateDirtyState]);

    const handleOnChange = (e: IChangeEvent) => {
      onChange(e);
      setIsFormTouched(true);
    };

    const resetFormState = (data = {}) => {
      updateDirtyState(false);
      setIsFormTouched(false);
      initialFormData.current = getFormState(schema, data, Ajv8Validator);
    };

    useImperativeHandle(ref, () => ({ resetFormState }));

    const customTransform = (errors: RJSFValidationError[]) => {
      return customTransformErrors(errors, customFormatsErrorMessages);
    };

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
        onChange={handleOnChange}
      />
    );
  }
);

FormBase.displayName = 'FormBase';

export default FormBase;
