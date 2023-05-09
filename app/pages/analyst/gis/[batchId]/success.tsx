import { withRelay, RelayProps } from 'relay-nextjs';
import { graphql, usePreloadedQuery } from 'react-relay';
import defaultRelayOptions from 'lib/relay/withRelayOptions';
import { BatchIdQuery } from '__generated__/BatchIdQuery.graphql';
import { ButtonLink, Layout } from 'components';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import ToggleDropdown from 'components/ToggleDropdown';

const StyledContainer = styled.div`
  margin-bottom: 5px;
  margin-top: 5px;
`;

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
        <h1>GIS Analysis Import</h1>
        <StyledContainer>
          <FontAwesomeIcon icon={faCircleCheck} color="#2E8540" /> GIS analysis
          added to {gisDataCounts.nodes[0].total} projects for the first time
        </StyledContainer>
        <ToggleDropdown
          items={gisDataCounts.nodes[0]?.ccbcNumbers?.split(',') || []}
          hideText="Hide Projects"
          showText="View Projects"
        />
        <StyledContainer>
          <FontAwesomeIcon icon={faCircleCheck} color="#2E8540" /> GIS analysis
          updated for {gisDataCounts.nodes[1].total} projects
        </StyledContainer>
        <ToggleDropdown
          items={gisDataCounts.nodes[1]?.ccbcNumbers?.split(',') || []}
          hideText="Hide Projects"
          showText="View Projects"
        />
        <StyledContainer>
          GIS analysis unchanged for {gisDataCounts.nodes[3].total} projects and
          was not updated
        </StyledContainer>
        <ToggleDropdown
          items={gisDataCounts.nodes[3]?.ccbcNumbers?.split(',') || []}
          hideText="Hide Projects"
          showText="View Projects"
        />
        <StyledContainer>
          GIS analysis unmatched for {gisDataCounts.nodes[2].total} projects
        </StyledContainer>
        <ToggleDropdown
          items={gisDataCounts.nodes[2]?.ccbcNumbers?.split(',') || []}
          hideText="Hide Projects"
          showText="View Projects"
        />
        <StyledContainer>
          Total processed {gisDataCounts.nodes[4].total}
        </StyledContainer>
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
