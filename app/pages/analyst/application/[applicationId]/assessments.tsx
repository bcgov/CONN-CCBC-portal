import { usePreloadedQuery } from 'react-relay/hooks';
import { withRelay, RelayProps } from 'relay-nextjs';
import { graphql } from 'react-relay';
import defaultRelayOptions from 'lib/relay/withRelayOptions';
import { Layout } from 'components';
import { assessmentsQuery } from '__generated__/assessmentsQuery.graphql';

const getAssessmentsQuery = graphql`
  query assessmentsQuery {
    session {
      sub
    }
  }
`;

const Assessments = ({
  preloadedQuery,
}: RelayProps<Record<string, unknown>, assessmentsQuery>) => {
  const { session } = usePreloadedQuery(getAssessmentsQuery, preloadedQuery);

  return (
    <Layout session={session} title="Connecting Communities BC">
      <h1>Assessments</h1>
    </Layout>
  );
};

export default withRelay(Assessments, getAssessmentsQuery, defaultRelayOptions);
