import { usePreloadedQuery } from 'react-relay/hooks';
import { withRelay, RelayProps } from 'relay-nextjs';
import { graphql } from 'react-relay';
import { useFeature } from '@growthbook/growthbook-react';
import { AnalystTable } from 'components/AnalystDashboard';
import styled from 'styled-components';
import defaultRelayOptions from '../../lib/relay/withRelayOptions';
import { ButtonLink, Layout } from '../../components';
import { dashboardAnalystQuery } from '../../__generated__/dashboardAnalystQuery.graphql';
// will probably have to change to cursor for pagination/infinte scroll
const getDashboardAnalystQuery = graphql`
  query dashboardAnalystQuery {
    session {
      sub
    }
    allApplications(orderBy: CCBC_NUMBER_ASC) {
      nodes {
        id
        ...AnalystRow_application
      }
    }
    allAnalysts(condition: { active: true }) {
      nodes {
        rowId
        givenName
        familyName
      }
    }
  }
`;

const StyledDashboardContainer = styled.div`
  display: block;
`;

const StyledBtnContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1.25rem;
`;

const AnalystDashboard = ({
  preloadedQuery,
}: RelayProps<Record<string, unknown>, dashboardAnalystQuery>) => {
  const { session, allAnalysts, allApplications } = usePreloadedQuery(
    getDashboardAnalystQuery,
    preloadedQuery
  );

  const exportAttachmentsBtn = useFeature('export_attachments_btn').value;

  return (
    <Layout session={session} title="Connecting Communities BC">
      <StyledDashboardContainer>
        <h1>Dashboard</h1>
        {exportAttachmentsBtn && (
          <StyledBtnContainer>
            <ButtonLink href="/api/analyst/archive">
              Export attachments
            </ButtonLink>
          </StyledBtnContainer>
        )}
        <AnalystTable
          applications={{ allApplications }}
          analysts={{ allAnalysts }}
        />
      </StyledDashboardContainer>
    </Layout>
  );
};

export default withRelay(
  AnalystDashboard,
  getDashboardAnalystQuery,
  defaultRelayOptions
);
