import { RJSFValidationError } from '@rjsf/utils';

const customTransformErrors = (
  errors: RJSFValidationError[],
  customFormatsErrorMessages: { [key: string]: string }
) =>
  // Ignore oneOf errors https://github.com/rjsf-team/react-jsonschema-form/issues/1263
  errors
    .filter((error) => error.name !== 'oneOf')
    // Ignore should be a string error for file uploads which are saved as array
    .filter((error) => error.message !== 'must be string')
    .map((error) => {
      if (!['format', 'required'].includes(error.name)) return error;
      if (error.name === 'required')
        return {
          ...error,
          message: `Please enter a value`,
        };
      if (customFormatsErrorMessages[error.params.format])
        return {
          ...error,
          message: customFormatsErrorMessages[error.params.format],
        };
      return error;
    });

export default customTransformErrors;
