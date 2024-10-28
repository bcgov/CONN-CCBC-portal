import { getDefaultFormState } from '@rjsf/utils';

const getFormState = (schema, formData, validator) => {
  return getDefaultFormState(validator, schema, formData, {}, false, {
    emptyObjectFields: 'populateRequiredDefaults',
    arrayMinItems: { populate: 'requiredOnly' },
  });
};

export default getFormState;
