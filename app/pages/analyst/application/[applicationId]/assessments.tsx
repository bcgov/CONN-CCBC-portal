import { usePreloadedQuery } from 'react-relay/hooks';
import { withRelay, RelayProps } from 'relay-nextjs';
import { graphql } from 'react-relay';
import defaultRelayOptions from 'lib/relay/withRelayOptions';
import Layout from 'components/Layout';
import AnalystLayout from 'components/Analyst/AnalystLayout';
import { assessmentsQuery } from '__generated__/assessmentsQuery.graphql';
import { FormBase } from 'components/Form';
import screening from 'formSchema/analyst/screening';
import screeningUiSchema from 'formSchema/uiSchema/analyst/screeningUi';
import { useCreateScreeningAssessmentMutation } from 'schema/mutations/assessment/createScreeningAssessment';
import { Button } from '@button-inc/bcgov-theme';
import { useState } from 'react';
import { ISubmitEvent } from '@rjsf/core';
import { LoadingSpinner } from 'components';

// replace with slug later with tabs
const getAssessmentsQuery = graphql`
  query assessmentsQuery($rowId: Int!) {
    applicationByRowId(rowId: $rowId) {
      rowId
      assessmentForm(_slug: "screeningAssessmentSchema") {
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

const Assessments = ({
  preloadedQuery,
}: RelayProps<Record<string, unknown>, assessmentsQuery>) => {
  const query = usePreloadedQuery(getAssessmentsQuery, preloadedQuery);

  const { applicationByRowId, session } = query;
  const [createAssessment, isCreating] = useCreateScreeningAssessmentMutation();
  const [isFormSaved, setIsFormSaved] = useState(false);

  const handleSubmit = async (e: ISubmitEvent<any>) => {
    createAssessment({
      variables: {
        input: {
          _applicationId: applicationByRowId.rowId,
          _jsonData: e.formData,
          schemaSlug: 'screeningAssessmentSchema',
        },
      },
      onCompleted: () => {
        setIsFormSaved(true);
      },
      optimisticResponse: {
        jsonData: e.formData,
      },
    });
  };

  return (
    <Layout session={session} title="Connecting Communities BC">
      <AnalystLayout query={query}>
        <h2>Assessments placeholder</h2>
        <div>
          {/* Tabs section here */}
          Screening
        </div>
        <FormBase
          schema={screening}
          uiSchema={screeningUiSchema}
          noValidate
          formData={applicationByRowId.assessmentForm?.jsonData}
          onChange={() => {
            setIsFormSaved(false);
          }}
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

export default withRelay(Assessments, getAssessmentsQuery, withRelayOptions);
