import { withRelay, RelayProps } from 'relay-nextjs';
import { graphql } from 'react-relay';
import { usePreloadedQuery } from 'react-relay/hooks';
import FormBase from 'components/Form/FormBase';
import { schema as fullSchema, analystUiSchema } from 'formSchema';
import defaultRelayOptions from '../../../lib/relay/withRelayOptions';
import FormDiv from '../../../components/FormDiv';
import Layout from '../../../components/Layout';
import { ApplicationIdQuery } from '../../../__generated__/ApplicationIdQuery.graphql';
import ReviewTheme from '../../../components/Review/ReviewTheme';

const getApplicationQuery = graphql`
  query ApplicationIdQuery($rowId: Int!) {
    applicationByRowId(rowId: $rowId) {
      formData {
        jsonData
      }
    }
    session {
      sub
    }
  }
`;

const Application = ({
  preloadedQuery,
}: RelayProps<Record<string, unknown>, ApplicationIdQuery>) => {
  const query = usePreloadedQuery(getApplicationQuery, preloadedQuery);

  const { applicationByRowId, session } = query;

  const {
    formData: { jsonData },
  } = applicationByRowId;

  return (
    <Layout session={session} title="Connecting Communities BC">
      <FormDiv style={{ margin: 'auto' }}>
        <h1>Application</h1>

        <FormBase
          theme={ReviewTheme}
          schema={fullSchema}
          uiSchema={analystUiSchema as any}
          formData={jsonData}
          liveValidate
          tagName="div"
        />
      </FormDiv>
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
