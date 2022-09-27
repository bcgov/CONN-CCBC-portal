import { FieldProps } from '@rjsf/core';
import { schema as fullSchema, reviewUiSchema } from 'formSchema';
import { FormBase } from 'components/Form';
import ReviewTheme from './ReviewTheme';
import styled from 'styled-components';
import Alert from '@button-inc/bcgov-theme/Alert';
import { JSONSchema7 } from 'json-schema';

const StyledAlert = styled(Alert)`
  margin-bottom: 32px;
`;

const ReviewPageField: React.FC<FieldProps> = (props) => {
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
  const { fullFormData, formErrorSchema } = formContext;

  const noErrors = Object.keys(formErrorSchema).length === 0;

  const handleAckChange = (ackData: boolean) => {
    onChange({
      ...formData,
      acknowledgeIncomplete: ackData,
    });
  };

  return (
    <>
      <p>
        Please review your responses before proceeding to the acknowledgement
        and submission pages.
      </p>
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

export default ReviewPageField;
