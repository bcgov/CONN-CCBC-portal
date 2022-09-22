import validateFormData from '@rjsf/core/dist/cjs/validate';
import schema from './schema';

const validate = (formData) => {
  const errorSchema = validateFormData(formData, schema)?.errorSchema;

  // Remove declarations errors from error schema since they aren't on review page
  delete errorSchema['acknowledgements'];
  delete errorSchema['submission'];

  return errorSchema;
};

export default validate;
