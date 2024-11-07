import { useRef, useState } from 'react';
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
import { useToast } from 'components/AppProvider';
import { FormBaseRef } from 'components/Form/FormBase';

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

const StyledNotifyButton = styled(Button)`
  svg {
    height: 18px;
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

  const { showToast, hideToast } = useToast();

  const [createAssessment, isCreating] = useCreateAssessmentMutation();
  const [newFormData, setNewFormData] = useState(formData);
  const [isFormSaved, setIsFormSaved] = useState(true);
  const [emailStatus, setEmailStatus] = useState<
    'idle' | 'inProgress' | 'sent'
  >('idle');
  const formRef = useRef<FormBaseRef>(null);

  const handleSubmit = async (e: IChangeEvent<any>) => {
    if (!isFormSaved) {
      createAssessment({
        variables: {
          input: {
            _applicationId: queryFragment.rowId,
            _jsonData: e.formData,
            _assessmentType: slug,
          },
          connections: [],
        },
        onCompleted: () => {
          setIsFormSaved(true);
          formRef.current?.resetFormState(e.formData);
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

  const notifyByEmail = async () => {
    hideToast();
    if (newFormData?.nextStep === 'Needs 2nd review') {
      setEmailStatus('inProgress');
      fetch('/api/email/notifySecondReviewRequest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          applicationId: queryFragment.rowId,
          host: window.location.origin,
          ccbcNumber: addedContext?.ccbcNumber,
          assessmentType: slug,
        }),
      }).then((response) => {
        if (!response.ok) {
          showToast(
            'Email notification did not work, please try again',
            'error',
            5000
          );
          Sentry.captureException({
            name: 'Email sending failed',
            message: response,
          });
          setEmailStatus('idle');
        } else {
          showToast('Email notification sent successfully', 'success', 5000);
          setEmailStatus('sent');
        }
        return response.json();
      });
    }
  };

  return (
    <StyledFormBase
      ref={formRef}
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
      &nbsp;
      <StyledNotifyButton
        variant="primary"
        disabled={
          newFormData?.nextStep !== 'Needs 2nd review' || emailStatus !== 'idle'
        }
        title="Email notification of 2nd review needed will be sent to Mike and Karina"
        onClick={notifyByEmail}
      >
        {emailStatus === 'inProgress' && <LoadingSpinner />} Notify by email
      </StyledNotifyButton>
      {isCreating && <LoadingSpinner />}
    </StyledFormBase>
  );
};
export default AssessmentsForm;
