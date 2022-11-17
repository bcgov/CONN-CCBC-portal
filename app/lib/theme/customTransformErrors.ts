import { AjvError } from '@rjsf/core';

const customTransformErrors = (
  errors: AjvError[],
  customFormatsErrorMessages: { [key: string]: string }
) =>
  // Ignore oneOf errors https://github.com/rjsf-team/react-jsonschema-form/issues/1263
  errors
    .filter((error) => error.name !== 'oneOf')
    // Ignore should be a string error for file uploads which are saved as array
    .filter((error) => error.message !== 'should be string')
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
