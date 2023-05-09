import { usePreloadedQuery } from 'react-relay/hooks';
import { withRelay, RelayProps } from 'relay-nextjs';
import { graphql } from 'react-relay';
import defaultRelayOptions from 'lib/relay/withRelayOptions';
import Layout from 'components/Layout';
import AnalystLayout from 'components/Analyst/AnalystLayout';
import { projectQuery } from '__generated__/projectQuery.graphql';
import { useFeature } from '@growthbook/growthbook-react';
import ConditionalApprovalForm from 'components/Analyst/Project/ConditionalApproval/ConditionalApprovalForm';
import AnnouncementsForm from 'components/Analyst/Project/Announcements/AnnouncementsForm';

const getProjectQuery = graphql`
  query projectQuery($rowId: Int!) {
    session {
      sub
    }
    applicationByRowId(rowId: $rowId) {
      ...ConditionalApprovalForm_application
    }
    ...AnalystLayout_query
    ...AnnouncementsForm_query
  }
`;

const Project = ({
  preloadedQuery,
}: RelayProps<Record<string, unknown>, projectQuery>) => {
  const query = usePreloadedQuery(getProjectQuery, preloadedQuery);
  const { applicationByRowId, session } = query;

  const showConditionalApproval = useFeature('show_conditional_approval').value;
  const showAnnouncement = useFeature('show_announcement').value;

  return (
    <Layout session={session} title="Connecting Communities BC">
      <AnalystLayout query={query}>
        {showConditionalApproval && (
          <ConditionalApprovalForm application={applicationByRowId} />
        )}
        {showAnnouncement && <AnnouncementsForm query={query} />}
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

export default withRelay(Project, getProjectQuery, withRelayOptions);
