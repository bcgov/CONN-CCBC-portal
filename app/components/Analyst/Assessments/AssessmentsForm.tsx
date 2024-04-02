import { useState } from 'react';
import styled from 'styled-components';
import { FormBase } from 'components/Form';
import Button from '@button-inc/bcgov-theme/Button';
import { graphql, useFragment } from 'react-relay';
import { IChangeEvent } from '@rjsf/core';
import LoadingSpinner from 'components/LoadingSpinner';
import { useCreateAssessmentMutation } from 'schema/mutations/assessment/createAssessment';
import assessmentsUiSchema from 'formSchema/uiSchema/analyst/assessmentsUiSchema';
import { RJSFSchema } from '@rjsf/utils';
import * as Sentry from '@sentry/nextjs';

interface Props {
  addedContext?: any;
  query: any;
  schema: RJSFSchema;
  slug: string;
  formData: any;
  uiSchema?: any;
}
const StyledFormBase = styled(FormBase)`
  // widget overrides
  .pg-select-wrapper,
  .datepicker-widget {
    width: 240px;
  }

  .pg-textarea {
    max-width: 460px;
  }

  .textarea-widget {
    margin-bottom: 8px;
  }
`;

const AssessmentsForm: React.FC<Props> = ({
  addedContext,
  formData,
  query,
  schema,
  slug,
  uiSchema,
}) => {
  const queryFragment = useFragment(
    graphql`
      fragment AssessmentsForm_query on Application {
        id
        rowId
      }
    `,
    query.applicationByRowId
  );

  const [createAssessment, isCreating] = useCreateAssessmentMutation();
  const [newFormData, setNewFormData] = useState(formData);
  const [isFormSaved, setIsFormSaved] = useState(true);

  const handleSubmit = async (e: IChangeEvent<any>) => {
    if (!isFormSaved) {
      createAssessment({
        variables: {
          input: {
            _applicationId: queryFragment.rowId,
            _jsonData: e.formData,
            _assessmentType: slug,
          },
        },
        onCompleted: () => {
          setIsFormSaved(true);
          if (
            slug === 'screening' &&
            e.formData?.nextStep === 'Needs 2nd review'
          ) {
            fetch('/api/email/notifySecondReviewRequest', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                applicationId: queryFragment.rowId,
                host: window.location.origin,
                ccbcNumber: addedContext?.ccbcNumber,
              }),
            }).then((response) => {
              if (!response.ok) {
                Sentry.captureException({
                  name: 'Email sending failed',
                  message: response,
                });
              }
              return response.json();
            });
          }
        },
        optimisticResponse: {
          jsonData: e.formData,
        },
        updater: (store, data) => {
          const application = store.get(queryFragment.id);
          application.setLinkedRecord(
            store.get(data.createAssessmentForm.assessmentData.id),
            'assessmentForm',
            { _assessmentDataType: slug }
          );
        },
      });
    }
  };

  return (
    <StyledFormBase
      schema={schema}
      uiSchema={uiSchema || assessmentsUiSchema}
      noValidate
      formData={newFormData}
      onChange={(e) => {
        setIsFormSaved(false);
        setNewFormData({ ...e.formData });
      }}
      omitExtraData={false}
      formContext={{
        ...addedContext,
        query,
      }}
      onSubmit={handleSubmit}
    >
      <Button variant="primary" disabled={isCreating}>
        {!isFormSaved ? 'Save' : 'Saved'}
      </Button>
      {isCreating && <LoadingSpinner />}
    </StyledFormBase>
  );
};
export default AssessmentsForm;
