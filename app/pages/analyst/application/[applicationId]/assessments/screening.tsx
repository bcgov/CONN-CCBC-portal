import { usePreloadedQuery } from 'react-relay/hooks';
import { withRelay, RelayProps } from 'relay-nextjs';
import { graphql } from 'react-relay';
import defaultRelayOptions from 'lib/relay/withRelayOptions';
import Layout from 'components/Layout';
import AnalystLayout from 'components/Analyst/AnalystLayout';
import { screeningAssessmentQuery } from '__generated__/screeningAssessmentQuery.graphql';
import { FormBase } from 'components/Form';
import AssessmentsTabs from 'components/Analyst/Assessments/AssessmentsTabs';
import screening from 'formSchema/analyst/screening';
import screeningUiSchema from 'formSchema/uiSchema/analyst/screeningUi';
import { useCreateScreeningAssessmentMutation } from 'schema/mutations/assessment/createScreeningAssessment';
import { Button } from '@button-inc/bcgov-theme';
import { useState } from 'react';
import { ISubmitEvent } from '@rjsf/core';
import { LoadingSpinner } from 'components';

// replace with slug later with tabs
const getScreeningAssessmentQuery = graphql`
  query screeningAssessmentQuery($rowId: Int!) {
    applicationByRowId(rowId: $rowId) {
      id
      rowId
      assessmentForm(_assessmentDataType: "screening") {
        jsonData
      }
    }
    session {
      sub
    }
    ...AnalystSelectWidget_query
    ...AnalystLayout_query
  }
`;

const ScreeningAssessment = ({
  preloadedQuery,
}: RelayProps<Record<string, unknown>, screeningAssessmentQuery>) => {
  const query = usePreloadedQuery(getScreeningAssessmentQuery, preloadedQuery);

  const { applicationByRowId, session } = query;
  const [createAssessment, isCreating] = useCreateScreeningAssessmentMutation();
  const [formData, setFormData] = useState(
    applicationByRowId.assessmentForm?.jsonData
  );
  const [isFormSaved, setIsFormSaved] = useState(false);

  const handleSubmit = async (e: ISubmitEvent<any>) => {
    createAssessment({
      variables: {
        input: {
          _applicationId: applicationByRowId.rowId,
          _jsonData: e.formData,
          _assessmentType: 'screening',
        },
      },
      onCompleted: () => {
        setIsFormSaved(true);
      },
      optimisticResponse: {
        jsonData: e.formData,
      },
      updater: (store, data) => {
        const application = store.get(applicationByRowId.id);
        application.setLinkedRecord(
          store.get(data.createAssessmentForm.assessmentData.id),
          'assessmentForm',
          { _assessmentDataType: 'screening' }
        );
      },
    });
  };

  return (
    <Layout session={session} title="Connecting Communities BC">
      <AnalystLayout query={query}>
        <AssessmentsTabs />
        <FormBase
          schema={screening}
          uiSchema={screeningUiSchema}
          noValidate
          formData={formData}
          onChange={(e) => {
            setIsFormSaved(false);
            setFormData({ ...e.formData });
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
      </AnalystLayout>
    </Layout>
  );
};

export const withRelayOptions = {
  ...defaultRelayOptions,

  variablesFromContext: (ctx) => {
    return {
      rowId: parseInt(ctx.query.applicationId.toString(), 10),
    };
  },
};

export default withRelay(
  ScreeningAssessment,
  getScreeningAssessmentQuery,
  withRelayOptions
);
