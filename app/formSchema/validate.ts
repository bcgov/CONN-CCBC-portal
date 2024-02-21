import { getDefaultFormState } from '@rjsf/utils';
import Ajv8Validator from '@rjsf/validator-ajv8';

const validate = (formData: any, schema: any) => {
  const fullFormData = getDefaultFormState(
    Ajv8Validator,
    schema,
    formData,
    {},
    true
  );
  const { errorSchema } = Ajv8Validator.validateFormData(fullFormData, schema);

  const fileUploadPages = [
    'templateUploads',
    'supportingDocuments',
    'coverage',
  ];

  // Remove 'should be string' errors for file upload fields which are saved as an array
  Object.keys(errorSchema).forEach((formPage) => {
    if (fileUploadPages.includes(formPage)) {
      const uploadPage = Object.keys(errorSchema[formPage]);
      uploadPage.forEach((uploadField) => {
        // eslint-disable-next-line @typescript-eslint/dot-notation
        const errors = errorSchema[formPage][uploadField]['__errors'];
        // if errors includes 'should be string' and the field is not required or it is an array (filled), delete the error
        if (
          (errors.includes('must be string') &&
            Array.isArray(fullFormData?.[formPage]?.[uploadField])) ||
          !schema.properties[formPage]?.required?.includes(uploadField)
        ) {
          delete errorSchema[formPage][uploadField];
        }
      });

      // Delete page from errorSchema if empty
      if (Object.keys(errorSchema[formPage]).length <= 0) {
        delete errorSchema[formPage];
      }
    }
  });

  // Remove declarations errors from error schema since they aren't on review page
  delete errorSchema.acknowledgements;
  delete errorSchema.submission;

  return errorSchema;
};

export default validate;
