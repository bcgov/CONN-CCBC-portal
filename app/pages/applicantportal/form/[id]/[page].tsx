import { useRouter } from 'next/router';
import { withRelay, RelayProps } from 'relay-nextjs';
import { usePreloadedQuery, graphql } from 'react-relay';
import Alert from '@button-inc/bcgov-theme/Alert';
import styled from 'styled-components';
import { useFeature } from '@growthbook/growthbook-react';
import defaultRelayOptions from '../../../../lib/relay/withRelayOptions';
import FormDiv from '../../../../components/FormDiv';
import { Layout, Stepper } from '../../../../components';
import { ApplicationForm, Back } from '../../../../components/Form';
import { PageQuery } from '../../../../__generated__/PageQuery.graphql';

const StyledAlert = styled(Alert)`
  margin-bottom: 32px;
`;

const getPageQuery = graphql`
  query PageQuery($rowId: Int!) {
    applicationByRowId(rowId: $rowId) {
      id
      owner
      status
      formData {
        formByFormSchemaId {
          jsonSchema
        }
      }
      ...ApplicationForm_application
    }
    session {
      sub
    }
    allForms(condition: { formType: "intake" }, last: 1) {
      nodes {
        rowId
        jsonSchema
      }
    }
    ...ApplicationForm_query
  }
`;

const FormPage = ({
  preloadedQuery,
}: RelayProps<Record<string, unknown>, PageQuery>) => {
  const query = usePreloadedQuery(getPageQuery, preloadedQuery);

  const forceLatestSchema = useFeature('draft_apps_use_latest_schema').value;
  const { applicationByRowId, session } = query;
  const { status } = applicationByRowId;
  const latestJsonSchema = query.allForms.nodes[0].jsonSchema;
  let jsonSchema: any;
  // eslint-disable-next-line no-self-compare
  if (forceLatestSchema && status === 'draft') {
    jsonSchema = latestJsonSchema;
  } else {
    jsonSchema = applicationByRowId.formData.formByFormSchemaId.jsonSchema;
  }
  const router = useRouter();

  const applicationId = Number(router.query.id);

  const pageNumber = Number(router.query.page);

  return (
    <Layout session={session} title="Connecting Communities BC">
      <Stepper schema={jsonSchema} />

      <FormDiv>
        {status === 'withdrawn' && (
          <StyledAlert id="review-alert" size="small" variant="warning">
            You can no longer edit this application because it is withdrawn.
          </StyledAlert>
        )}
        {status === 'submitted' && (
          <StyledAlert id="review-alert" size="small" variant="info">
            Edits are automatically saved and submitted.
          </StyledAlert>
        )}
        <Back applicationId={applicationId} pageNumber={pageNumber} />
        <ApplicationForm
          pageNumber={pageNumber}
          application={applicationByRowId}
          query={query}
        />
      </FormDiv>
    </Layout>
  );
};

export const withRelayOptions = {
  ...defaultRelayOptions,

  variablesFromContext: (ctx) => ({
    rowId: parseInt(ctx.query.id.toString(), 10),
  }),
};

export default withRelay(FormPage, getPageQuery, withRelayOptions);
