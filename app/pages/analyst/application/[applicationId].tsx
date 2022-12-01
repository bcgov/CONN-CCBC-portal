import { useMemo } from 'react';
import { withRelay, RelayProps } from 'relay-nextjs';
import { graphql } from 'react-relay';
import { usePreloadedQuery } from 'react-relay/hooks';
import FormBase from 'components/Form/FormBase';
import { analystUiSchema, validate } from 'formSchema';
import defaultRelayOptions from 'lib/relay/withRelayOptions';
import Layout from 'components/Layout';
import { ApplicationIdQuery } from '__generated__/ApplicationIdQuery.graphql';
import ReviewTheme from 'components/Review/ReviewTheme';
import AnalystLayout from 'components/Analyst/AnalystLayout';

const getApplicationQuery = graphql`
  query ApplicationIdQuery($rowId: Int!) {
    applicationByRowId(rowId: $rowId) {
      ...AnalystLayout_application
      formData {
        jsonData
        formByFormSchemaId {
          jsonSchema
        }
      }
    }
    session {
      sub
    }
    ...AnalystLayout_query
  }
`;

const Application = ({
  preloadedQuery,
}: RelayProps<Record<string, unknown>, ApplicationIdQuery>) => {
  const query = usePreloadedQuery(getApplicationQuery, preloadedQuery);
  const { applicationByRowId, session } = query;
  const {
    formData: {
      jsonData,
      formByFormSchemaId: { jsonSchema },
    },
  } = applicationByRowId;

  const formErrorSchema = useMemo(() => validate(jsonData), [jsonData]);

  return (
    <Layout session={session} title="Connecting Communities BC">
      <AnalystLayout query={query} application={applicationByRowId}>
        <FormBase
          theme={ReviewTheme}
          schema={jsonSchema}
          uiSchema={analystUiSchema as any}
          liveValidate
          formContext={{
            // validate errors and pass through formContext for review checkbox section
            errors: formErrorSchema,
          }}
          formData={jsonData}
          tagName="div"
        />
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

export default withRelay(Application, getApplicationQuery, withRelayOptions);
