import { useRouter } from 'next/router';
import { usePreloadedQuery } from 'react-relay/hooks';
import { withRelay, RelayProps } from 'relay-nextjs';
import { graphql } from 'react-relay';
import type { JSONSchema7 } from 'json-schema';
import defaultRelayOptions from 'lib/relay/withRelayOptions';
import Button from '@button-inc/bcgov-theme/Button';
import FormBase from 'components/Form/FormBase';
import Layout from 'components/Layout';
import { schema, uiSchema } from 'formSchema';
import { AnalystLayout } from 'components/Analyst';
import { SectionQuery } from '__generated__/SectionQuery.graphql';
import ButtonLink from 'dist/components/ButtonLink';

const getSectionQuery = graphql`
  query SectionQuery($rowId: Int!) {
    applicationByRowId(rowId: $rowId) {
      formData {
        jsonData
        # formByFormSchemaId {
        #   jsonSchema
        # }
      }
    }
    session {
      sub
    }
    ...AnalystLayout_query
  }
`;

const EditApplication = ({
  preloadedQuery,
}: RelayProps<Record<string, unknown>, SectionQuery>) => {
  const query = usePreloadedQuery(getSectionQuery, preloadedQuery);
  const {
    session,
    applicationByRowId: {
      formData: {
        jsonData,
        // formByFormSchemaId: { jsonSchema },
      },
    },
  } = query;

  const router = useRouter();
  const sectionName = router.query.section as string;
  const applicationId = router.query.applicationId as string;
  const sectionSchema = schema.properties[sectionName] as JSONSchema7;

  return (
    <Layout session={session} title="Connecting Communities BC">
      <AnalystLayout query={query}>
        <h2>Application</h2>
        <hr />
        <h3>{sectionSchema.title}</h3>
        <FormBase
          formData={jsonData[sectionName]}
          schema={sectionSchema}
          uiSchema={uiSchema[sectionName]}
        >
          <ButtonLink href="#modal-id">Save</ButtonLink>
          <Button
            variant="secondary"
            style={{ marginLeft: '24px' }}
            onClick={(e: React.MouseEvent<HTMLInputElement>) => {
              e.preventDefault();
              router.push(`/analyst/application/${applicationId}`);
            }}
          >
            Cancel
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

export default withRelay(EditApplication, getSectionQuery, withRelayOptions);
