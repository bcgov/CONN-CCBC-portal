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

// replace with slug later with tabs
const getAssessmentsQuery = graphql`
  query assessmentsQuery($rowId: Int!) {
    applicationByRowId(rowId: $rowId) {
      ...AnalystLayout_application
      rowId
      assessmentForm(_slug: "screeningAssessmentSchema") {
        jsonData
      }
    }
    ...AnalystSelectWidget_query
    session {
      sub
    }
    ...AnalystLayout_query
  }
`;

const Assessments = ({
  preloadedQuery,
}: RelayProps<Record<string, unknown>, assessmentsQuery>) => {
  const query = usePreloadedQuery(getAssessmentsQuery, preloadedQuery);

  const { applicationByRowId, session, allAnalysts } = query;
  const [formData, setFormData] = useState(
    applicationByRowId.assessmentForm?.jsonData
  );
  const [createAssessment, isCreating] = useCreateScreeningAssessmentMutation();

  const handleSubmit = async (newFormData: any) => {
    createAssessment({
      variables: {
        input: {
          _applicationId: applicationByRowId.rowId,
          _jsonData: newFormData,
          schemaSlug: 'screeningAssessmentSchema',
        },
      },
      onCompleted: () => {},
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
          onChange={(e) => {
            setFormData(e.formData);
          }}
          formData={formData}
          formContext={{ query }}
          tagName="div"
          onSubmit={handleSubmit}
        >
          <Button
            variant="primary"
            onClick={() => handleSubmit(formData)}
            disabled={isCreating}
          >
            Submit
          </Button>
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
