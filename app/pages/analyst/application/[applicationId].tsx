import { useMemo } from 'react';
import { withRelay, RelayProps } from 'relay-nextjs';
import { graphql } from 'react-relay';
import { usePreloadedQuery } from 'react-relay/hooks';
import styled from 'styled-components';
import FormBase from 'components/Form/FormBase';
import { schema as fullSchema, analystUiSchema, validate } from 'formSchema';
import defaultRelayOptions from 'lib/relay/withRelayOptions';
import FormDiv from 'components/FormDiv';
import Layout from 'components/Layout';
import { ApplicationIdQuery } from '__generated__/ApplicationIdQuery.graphql';
import ReviewTheme from 'components/Review/ReviewTheme';
import NavigationSidebar from 'components/Analyst/NavigationSidebar';

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

const StyledContainer = styled.div`
  display: flex;
`;

const StyledFlex = styled.div`
  display: flex;
  flex-direction: column;
`;

const Application = ({
  preloadedQuery,
}: RelayProps<Record<string, unknown>, ApplicationIdQuery>) => {
  const query = usePreloadedQuery(getApplicationQuery, preloadedQuery);
  const { applicationByRowId, session } = query;
  const {
    formData: { jsonData },
  } = applicationByRowId;

  const formErrorSchema = useMemo(() => validate(jsonData), [jsonData]);

  return (
    <Layout session={session} title="Connecting Communities BC">
      <StyledFlex>
        <h1>Application</h1>

        <StyledContainer>
          <NavigationSidebar />
          <FormDiv style={{ margin: 'auto' }}>
            <FormBase
              theme={ReviewTheme}
              schema={fullSchema}
              uiSchema={analystUiSchema as any}
              liveValidate
              formContext={{
                // validate errors and pass through formContext for review checkbox section
                errors: formErrorSchema,
              }}
              formData={jsonData}
              tagName="div"
            />
          </FormDiv>
        </StyledContainer>
      </StyledFlex>
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
