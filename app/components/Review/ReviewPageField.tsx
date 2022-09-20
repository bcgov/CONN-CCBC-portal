import { FieldProps } from '@rjsf/core';
import fullSchema from 'formSchema/schema';
import { useMemo } from 'react';
import validateFormData from '@rjsf/core/dist/cjs/validate';
import { FormBase } from 'components/Form';
import ReviewTheme from './ReviewTheme';
import styled from 'styled-components';
import Alert from '@button-inc/bcgov-theme/Alert';
import reviewUiSchema from 'formSchema/reviewUiSchema';
import { JSONSchema7 } from 'json-schema';

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

const StyledAlert = styled(Alert)`
  margin-bottom: 32px;
`;

const ReviewField: React.FC<FieldProps> = (props) => {
  const {
    schema,
    formContext,
    registry,
    idSchema,
    uiSchema,
    formData,
    errorSchema,
    onChange,
    onBlur,
    onFocus,
  } = props;
  const { fullFormData } = formContext;
  const formErrorSchema = useMemo(
    () => formatErrorSchema(fullFormData, fullSchema),
    [fullFormData]
  );
  const noErrors = Object.keys(formErrorSchema).length === 0;

  const handleAckChange = (ackData: boolean) => {
    onChange({
      ...formData,
      acknowledgeIncomplete: ackData,
    });
  };

  return (
    <>
      <p>Please review your responses.</p>
      <StyledAlert
        id="review-alert"
        size="small"
        variant={noErrors ? 'success' : 'danger'}
      >
        {noErrors
          ? 'All fields are complete'
          : 'There are empty fields in your application. Applications with unanswered fields may not be assessed.'}
      </StyledAlert>
      <FormBase
        theme={ReviewTheme}
        schema={fullSchema}
        uiSchema={reviewUiSchema as any}
        formData={fullFormData}
        liveValidate
        tagName="div"
      />
      {!noErrors && (
        <registry.fields.BooleanField
          required
          schema={schema.properties.acknowledgeIncomplete as JSONSchema7}
          uiSchema={uiSchema}
          idSchema={idSchema.acknowledgeIncomplete}
          formData={formData?.acknowledgeIncomplete}
          autofocus={false}
          disabled={false}
          errorSchema={errorSchema?.acknowledgeIncomplete}
          onChange={handleAckChange}
          onBlur={onBlur}
          onFocus={onFocus}
          registry={registry}
          formContext={formContext}
          readonly={false}
          name="acknowledgeIncomplete"
        />
      )}
    </>
  );
};

export default ReviewField;
