import validateFormData from '@rjsf/core/dist/cjs/validate';
import schema from './schema';

const validate = (formData) => {
  const errorSchema = validateFormData(formData, schema)?.errorSchema;

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

        if (errors.includes('should be string')) {
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
