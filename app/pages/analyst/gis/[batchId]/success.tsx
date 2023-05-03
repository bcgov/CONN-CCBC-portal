import { withRelay, RelayProps } from 'relay-nextjs';
import { graphql, usePreloadedQuery } from 'react-relay';
import defaultRelayOptions from 'lib/relay/withRelayOptions';
import { BatchIdQuery } from '__generated__/BatchIdQuery.graphql';
import { ButtonLink, Layout } from 'components';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';

const StyledContainer = styled.div``;

const getGisUploadSuccessQuery = graphql`
  query successGisUploadQuery($batchId: Int!) {
    gisDataCounts(batchid: $batchId) {
      nodes {
        total
        countType
        ccbcNumbers
      }
    }
    session {
      ...DashboardTabs_query
      sub
    }
  }
`;

const BatchIdPage: React.FC<
  RelayProps<Record<string, unknown>, BatchIdQuery>
> = ({ preloadedQuery }) => {
  const { gisDataCounts, session } = usePreloadedQuery<BatchIdQuery>(
    getGisUploadSuccessQuery,
    preloadedQuery
  );

  return (
    <Layout session={session} title="Connecting Communities BC">
      <StyledContainer>
        <p>
          <FontAwesomeIcon icon={faCircleCheck} color="#2E8540" /> GIS
          information successfully added to {gisDataCounts.nodes[2].total}{' '}
          projects
        </p>
        <ButtonLink href="/analyst/dashboard">Return to dashboard</ButtonLink>
      </StyledContainer>
    </Layout>
  );
};

export const withRelayOptions = {
  ...defaultRelayOptions,
  variablesFromContext: (ctx) => ({
    batchId: parseInt(ctx.query.batchId.toString(), 10),
  }),
};

export default withRelay(
  BatchIdPage,
  getGisUploadSuccessQuery,
  withRelayOptions
);
