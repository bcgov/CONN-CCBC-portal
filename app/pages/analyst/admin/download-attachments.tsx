import { usePreloadedQuery } from 'react-relay/hooks';
import { withRelay, RelayProps } from 'relay-nextjs';
import { graphql } from 'react-relay';
import { DashboardTabs } from 'components/AnalystDashboard';
import styled from 'styled-components';
import defaultRelayOptions from 'lib/relay/withRelayOptions';
import { Layout } from 'components';
import { downloadAttachmentsQuery } from '__generated__/downloadAttachmentsQuery.graphql';

const getDownloadAttachmentsQuery = graphql`
  query downloadAttachmentsQuery {
    session {
      sub
    }
    ...AnalystTable_query
  }
`;

const StyledContainer = styled.div`
  width: 100%;
`;

const DownloadAttachments = ({
  preloadedQuery,
}: RelayProps<Record<string, unknown>, downloadAttachmentsQuery>) => {
  const query = usePreloadedQuery(getDownloadAttachmentsQuery, preloadedQuery);
  const { session } = query;

  return (
    <Layout session={session} title="Connecting Communities BC">
      <StyledContainer>
        <DashboardTabs />
      </StyledContainer>
    </Layout>
  );
};

export default withRelay(
  DownloadAttachments,
  getDownloadAttachmentsQuery,
  defaultRelayOptions
);
