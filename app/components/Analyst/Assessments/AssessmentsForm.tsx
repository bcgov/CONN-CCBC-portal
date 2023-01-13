import { useState } from 'react';
import { FormBase } from 'components/Form';
import Button from '@button-inc/bcgov-theme/Button';
import { graphql, useFragment } from 'react-relay';
import { ISubmitEvent } from '@rjsf/core';
import LoadingSpinner from 'components/LoadingSpinner';
import type { JSONSchema7 } from 'json-schema';
import { useCreateAssessmentMutation } from 'schema/mutations/assessment/createAssessment';
import assessmentsUiSchema from 'formSchema/uiSchema/analyst/assessmentsUiSchema';

interface Props {
  query: any;
  schema: JSONSchema7;
  slug: string;
  formData: any;
  uiSchema?: any;
}

const AssessmentsForm: React.FC<Props> = ({
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
  const [isFormSaved, setIsFormSaved] = useState(false);

  const handleSubmit = async (e: ISubmitEvent<any>) => {
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
  };

  return (
    <FormBase
      schema={schema}
      uiSchema={uiSchema || assessmentsUiSchema}
      noValidate
      formData={newFormData}
      onChange={(e) => {
        setIsFormSaved(false);
        setNewFormData({ ...e.formData });
      }}
      omitExtraData={false}
      formContext={{ query }}
      onSubmit={handleSubmit}
    >
      <Button variant="primary" disabled={isCreating}>
        {!isFormSaved ? 'Save' : 'Saved'}
      </Button>
      {isCreating && <LoadingSpinner />}
    </FormBase>
  );
};
export default AssessmentsForm;
