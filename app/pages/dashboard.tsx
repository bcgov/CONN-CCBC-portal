import { useRouter } from 'next/router';
import { withRelay, RelayProps } from 'relay-nextjs';
import defaultRelayOptions from '../lib/relay/withRelayOptions';
import { usePreloadedQuery } from 'react-relay/hooks';
import { graphql } from 'react-relay';
import StyledGovButton from '../components/StyledGovButton';
import { useCreateApplicationMutation } from '../schema/mutations/application/createApplication';
import { Layout } from '../components';
import { DashboardTable } from '../components/Dashboard';
import { dashboardQuery } from '../__generated__/dashboardQuery.graphql';

const getDashboardQuery = graphql`
  query dashboardQuery($formOwner: ApplicationCondition!) {
    allApplications(condition: $formOwner) {
      nodes {
        id
        rowId
        owner
        referenceNumber
        status
        projectName
        ccbcId
      }
    }
    session {
      sub
    }
  }
`;
// eslint-disable-next-line @typescript-eslint/ban-types
const Dashboard = ({ preloadedQuery }: RelayProps<{}, dashboardQuery>) => {
  const query = usePreloadedQuery(getDashboardQuery, preloadedQuery);
  const { allApplications, session } = query;

  const trimmedSub: string = session?.sub.replace(/-/g, '');

  const hasApplications = allApplications.nodes.length > 0;

  const router = useRouter();

  const [createApplication] = useCreateApplicationMutation();

  const handleCreateApplication = () => {
    createApplication({
      variables: {
        // input: { application: { owner: session?.sub } },
        input: { application: { owner: trimmedSub } },
      },
      onCompleted: (response) => {
        const applicationId = response.createApplication.application.rowId;
        router.push(`/form/${applicationId}/1`);
      },
      onError: () => {
        // This needs to be removed once application dashboard implemented
        router.push('/dashboard');
      },
    });
  };

  return (
    <Layout session={session} title="Connecting Communities BC">
      <div>
        <h1>Dashboard</h1>
        <p>
          Start a new application; applications can be saved and edited until
          the intake closes on YYYY/MM/DD
        </p>
        <StyledGovButton onClick={handleCreateApplication}>
          New application
        </StyledGovButton>
      </div>
      {hasApplications ? (
        <DashboardTable applications={query} />
      ) : (
        <p>Applications will appear here</p>
      )}
    </Layout>
  );
};

export const withRelayOptions = {
  ...defaultRelayOptions,

  variablesFromContext: (ctx) => {
    const trimmedSub: string = ctx?.req?.claims?.sub.replace(/-/g, '');

    return {
      formOwner: { owner: trimmedSub },
    };
  },
};

export default withRelay(Dashboard, getDashboardQuery, withRelayOptions);
