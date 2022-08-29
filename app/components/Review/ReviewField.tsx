import { FieldProps } from '@rjsf/core';
import { Review } from 'dist/components/Review';
import getSchema from 'formSchema/schema';
import { useMemo, useState } from 'react';
import validateFormData from '@rjsf/core/dist/cjs/validate';

const formatErrorSchema = (formData, schema) => {
  const errorSchema = validateFormData(formData, schema)?.errorSchema;

  // Remove declarations errors from error schema since they aren't on review page
  delete errorSchema['acknowledgements'];
  delete errorSchema['submission'];

  // This is a workaround for 'should be array' error and the schema/radio widget
  // should ideally be refactored so we don't need this.
  const arrayError =
    errorSchema?.organizationProfile?.typeOfOrganization?.__errors[0] ===
    'should be array';
  if (arrayError && Object.keys(errorSchema.organizationProfile).length <= 1) {
    delete errorSchema['organizationProfile'];
  }

  return errorSchema;
};

const ReviewField: React.FC<FieldProps> = ({ formContext }) => {
  const { formData } = formContext;
  const [reviewConfirm, setReviewConfirm] = useState(false);
  const schema = useMemo(() => getSchema(formData), [formData]);
  const formErrorSchema = useMemo(
    () => formatErrorSchema(formData, schema),
    [formData, schema]
  );
  const noErrors = Object.keys(formErrorSchema).length === 0;

  return (
    <>
      <p>Please review your responses.</p>
      <Review
        formData={formData}
        formSchema={schema}
        reviewConfirm={reviewConfirm}
        onReviewConfirm={() => setReviewConfirm(!reviewConfirm)}
        formErrorSchema={formErrorSchema}
        noErrors={noErrors}
      />
    </>
  );
};

export default ReviewField;
