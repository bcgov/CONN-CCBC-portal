import { RJSFValidationError, getDefaultFormState } from '@rjsf/utils';
import Ajv8Validator from '@rjsf/validator-ajv8';
import { customFormatsErrorMessages } from 'data/jsonSchemaForm/customFormats';
import customTransformErrors from 'lib/theme/customTransformErrors';
import { replaceEmptyArrays } from 'utils/formatArrays';

const customTransform = (errors: RJSFValidationError[]) => {
  return customTransformErrors(errors, customFormatsErrorMessages);
};

const validate = (formData: any, schema: any) => {
  // temporary hack to remove all the empty defaults arrays from the form data
  // could be removed once the issue is fixed in rjsf in version 5.18.0 passing 'skip-empty-defaults'
  // https://github.com/rjsf-team/react-jsonschema-form/pull/4085
  const formStateWithDefaults = replaceEmptyArrays(
    getDefaultFormState(Ajv8Validator, schema, formData, {}, true)
  );

  const fullFormData = {
    ...formStateWithDefaults,
    ...formData,
  };

  const { errorSchema } = Ajv8Validator.validateFormData(
    fullFormData,
    schema,
    undefined,
    // passing error transform to remove additional errors passed from ajv
    // eg. must be a string | enum value issue
    customTransform
  );

  // Remove declarations errors from error schema since they aren't on review page
  delete errorSchema.acknowledgements;
  delete errorSchema.submission;

  return errorSchema;
};

export default validate;
