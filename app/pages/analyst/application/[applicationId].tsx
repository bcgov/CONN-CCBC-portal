import { useMemo, useState } from 'react';
import { withRelay, RelayProps } from 'relay-nextjs';
import { usePreloadedQuery, graphql } from 'react-relay';
import FormBase from 'components/Form/FormBase';
import { analystUiSchema, validate } from 'formSchema';
import defaultRelayOptions from 'lib/relay/withRelayOptions';
import Layout from 'components/Layout';
import budgetDetails from 'formSchema/pages/budgetDetails';
import { ApplicationIdQuery } from '__generated__/ApplicationIdQuery.graphql';
import ReviewTheme from 'components/Review/ReviewTheme';
import AnalystLayout from 'components/Analyst/AnalystLayout';
import styled from 'styled-components';
import { useRouter } from 'next/router';

const StyledButton = styled('button')`
  color: ${(props) => props.theme.color.links};
`;

const RightAlignText = styled('div')`
  padding-top: 20px;
  text-align: right;
  padding-bottom: 4px;
`;

const getApplicationQuery = graphql`
  query ApplicationIdQuery($rowId: Int!) {
    applicationByRowId(rowId: $rowId) {
      status
      formData {
        rowId
        jsonData
        formByFormSchemaId {
          jsonSchema
        }
      }
      applicationRfiDataByApplicationId(
        orderBy: RFI_DATA_ID_DESC
        filter: { rfiDataByRfiDataId: { archivedAt: { isNull: true } } }
      ) {
        edges {
          node {
            rfiDataByRfiDataId {
              jsonData
              id
              rowId
              rfiNumber
              attachments {
                nodes {
                  id
                  file
                  fileName
                  rowId
                  createdAt
                }
              }
            }
          }
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
  const router = useRouter();
  const expandAll = router.query.expandAll === 'true';
  const query = usePreloadedQuery(getApplicationQuery, preloadedQuery);
  const [toggleOverride, setToggleExpandOrCollapseAll] = useState<
    boolean | undefined
  >(expandAll ? true : undefined);
  const { applicationByRowId, session } = query;
  const {
    status,
    formData: {
      jsonData,
      formByFormSchemaId: { jsonSchema },
    },
    applicationRfiDataByApplicationId,
  } = applicationByRowId;
  const isEditable = status !== 'withdrawn';
  const { section: toggledSection } = useRouter().query;

  const rfiList = applicationRfiDataByApplicationId?.edges?.map(
    (edge) => edge.node.rfiDataByRfiDataId
  );

  // Budget details was removed from the applicant schema but we want to display in for Analysts
  // no matter which schema is returned from the database
  const formSchema = {
    ...jsonSchema,
    properties: {
      ...jsonSchema.properties,
      ...budgetDetails,
    },
  };

  const formErrorSchema = useMemo(
    () => validate(jsonData, jsonSchema),
    [jsonData, jsonSchema]
  );
  return (
    <Layout session={session} title="Connecting Communities BC">
      <AnalystLayout query={query}>
        <RightAlignText>
          <StyledButton
            onClick={() => {
              setToggleExpandOrCollapseAll(true);
            }}
            type="button"
          >
            Expand all
          </StyledButton>
          {' | '}
          <StyledButton
            onClick={() => {
              setToggleExpandOrCollapseAll(false);
            }}
            type="button"
          >
            Collapse all
          </StyledButton>
        </RightAlignText>
        <FormBase
          theme={ReviewTheme}
          schema={formSchema}
          uiSchema={analystUiSchema as any}
          liveValidate
          formContext={{
            // validate errors and pass through formContext for review checkbox section
            errors: formErrorSchema,
            rfiList,
            toggleOverride,
            toggledSection,
            isEditable,
            skipUnsavedWarning: true,
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
