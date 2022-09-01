import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { withRelay, RelayProps } from 'relay-nextjs';
import defaultRelayOptions from '../lib/relay/withRelayOptions';
import { usePreloadedQuery } from 'react-relay/hooks';
import { graphql } from 'react-relay';
import StyledGovButton from '../components/StyledGovButton';
import { useCreateApplicationMutation } from '../schema/mutations/application/createApplication';
import { IntakeAlert, Layout } from '../components';
import { DashboardTable } from '../components/Dashboard';
import { dashboardQuery } from '../__generated__/dashboardQuery.graphql';
import { DateTime } from 'luxon';

const getDashboardQuery = graphql`
  query dashboardQuery($formOwner: ApplicationCondition!) {
    allApplications(condition: $formOwner, orderBy: CREATED_AT_DESC) {
      nodes {
        id
        rowId
        owner
        status
        projectName
        ccbcNumber
        lastEditedPage
        intakeByIntakeId {
          ccbcIntakeNumber
          closeTimestamp
          openTimestamp
        }
      }
    }
    session {
      sub
    }
    openIntake {
      closeTimestamp
    }
  }
`;

const Dashboard = ({
  preloadedQuery,
}: RelayProps<Record<string, unknown>, dashboardQuery>) => {
  const query = usePreloadedQuery(getDashboardQuery, preloadedQuery);
  const { allApplications, session, openIntake } = query;

  const closeTimestamp = openIntake?.closeTimestamp;

  const sub: string = session?.sub;

  const hasApplications = allApplications.nodes.length > 0;

  const router = useRouter();

  const [createApplication] = useCreateApplicationMutation();

  useEffect(() => {
    // check if session is still valid
    if (!sub) router.push('/');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreateApplication = () => {
    createApplication({
      variables: {
        input: {},
      },
      onCompleted: (response) => {
        const applicationId = response.createApplication.application.rowId;
        router.push(`/form/${applicationId}/1`);
      },
      onError: () => {
        // This needs to be removed once application dashboard implemented
        router.push('/');
      },
    });
  };

  return (
    <Layout session={session} title="Connecting Communities BC">
      <div>
        <h1>Dashboard</h1>
        {closeTimestamp ? (
          <p>
            Start a new application; applications can be saved and edited until
            the intake closes on{' '}
            {DateTime.fromISO(closeTimestamp, {
              locale: 'en-CA',
              zone: 'America/Vancouver',
            }).toLocaleString(DateTime.DATETIME_FULL)}
          </p>
        ) : (
          <IntakeAlert />
        )}
        <StyledGovButton
          onClick={handleCreateApplication}
          disabled={!openIntake}
        >
          Create application
        </StyledGovButton>
      </div>
      {hasApplications && openIntake && <DashboardTable applications={query} />}
      {!hasApplications && openIntake && <p>Applications will appear here</p>}
    </Layout>
  );
};

export const withRelayOptions = {
  ...defaultRelayOptions,

  variablesFromContext: (ctx) => {
    const sub: string = ctx?.req?.claims?.sub;

    return {
      formOwner: { owner: sub },
    };
  },
};

export default withRelay(Dashboard, getDashboardQuery, withRelayOptions);
