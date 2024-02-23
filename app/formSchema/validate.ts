import { RJSFValidationError, getDefaultFormState } from '@rjsf/utils';
import Ajv8Validator from '@rjsf/validator-ajv8';
import { customFormatsErrorMessages } from 'data/jsonSchemaForm/customFormats';
import customTransformErrors from 'lib/theme/customTransformErrors';

const customTransform = (errors: RJSFValidationError[]) => {
  return customTransformErrors(errors, customFormatsErrorMessages);
};

const validate = (formData: any, schema: any) => {
  const fullFormData = getDefaultFormState(
    Ajv8Validator,
    schema,
    formData,
    {},
    true
  );

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
