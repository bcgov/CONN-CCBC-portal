import { FieldProps, RJSFSchema } from '@rjsf/utils';
import reviewUiSchema from 'formSchema/reviewUiSchema';
import FormBase from 'components/Form/FormBase';
import styled from 'styled-components';
import Alert from '@button-inc/bcgov-theme/Alert';
import ReviewTheme from './ReviewTheme';

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
  const { fullFormData, finalUiSchema, formSchema, formErrorSchema } =
    formContext;
  // This is to remove the accepted geographic area from the review page
  // Otherwise it will show an empty row
  const fs = {
    ...formSchema,
    properties: {
      ...formSchema.properties,
      projectArea: {
        ...formSchema.properties.projectArea,
        properties: {
          firstNationsLed: {
            ...formSchema.properties.projectArea.properties.firstNationsLed,
          },
          geographicArea: {
            ...formSchema.properties.projectArea.properties.geographicArea,
          },
          projectSpanMultipleLocations: {
            ...formSchema.properties.projectArea.properties
              .projectSpanMultipleLocations,
          },
        },
      },
    },
  };
  const noErrors = Object.keys(formErrorSchema).length === 0;

  const handleAckChange = (ackData: boolean) => {
    onChange({
      ...formData,
      acknowledgeIncomplete: ackData,
    });
  };

  const finalApplicantUiSchema = {
    ...reviewUiSchema,
    benefits: {
      ...reviewUiSchema.benefits,
      ...finalUiSchema.benefits,
    },
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
        schema={fs}
        uiSchema={finalApplicantUiSchema as any}
        formData={fullFormData}
        formContext={formContext}
        liveValidate
        tagName="div"
      />
      {!noErrors && (
        <registry.fields.BooleanField
          required
          schema={schema.properties.acknowledgeIncomplete as RJSFSchema}
          uiSchema={uiSchema}
          idSchema={idSchema.acknowledgeIncomplete}
          formData={formData?.acknowledgeIncomplete}
          autofocus={false}
          disabled={!formContext.isEditable}
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
