import { usePreloadedQuery } from 'react-relay/hooks';
import { withRelay, RelayProps } from 'relay-nextjs';
import { graphql } from 'react-relay';
import styled from 'styled-components';
import { DashboardTabs } from 'components/AnalystDashboard';
import defaultRelayOptions from 'lib/relay/withRelayOptions';
import { Layout } from 'components';
import { AddIntake, AdminTabs, Intake } from 'components/Admin';
import { applicationIntakesQuery } from '__generated__/applicationIntakesQuery.graphql';

const getApplicationIntakesQuery = graphql`
  query applicationIntakesQuery {
    allIntakes(first: 999, orderBy: CCBC_INTAKE_NUMBER_DESC)
      @connection(key: "ApplicationIntakes_allIntakes") {
      __id
      edges {
        node {
          ccbcIntakeNumber
          ...Intake_query
        }
      }
    }
    openIntake {
      ccbcIntakeNumber
    }
    session {
      sub
      ...DashboardTabs_query
    }
  }
`;

const StyledContainer = styled.div`
  width: 100%;
  padding: 0 4px;
`;

const ApplicationIntakes = ({
  preloadedQuery,
}: RelayProps<Record<string, unknown>, applicationIntakesQuery>) => {
  const query = usePreloadedQuery(getApplicationIntakesQuery, preloadedQuery);
  const { allIntakes, openIntake, session } = query;
  const intakeList = allIntakes?.edges;

  return (
    <Layout session={session} title="Connecting Communities BC">
      <StyledContainer>
        <DashboardTabs session={session} />
        <AdminTabs />
        <h2>Application Intakes</h2>
        <p>
          All times are in Pacific Time and automatically adjusted for daylight
          saving time where necessary.
        </p>
        <p>Applicants have a grace period after each deadline.</p>
        <p>
          To adjust the grace period or toggle visibility of upcoming intake
          dates, go to https://app.growthbook.io/
        </p>
        {intakeList && (
          <section>
            {intakeList.map((intake: any) => {
              return (
                <Intake
                  key={intake.node.ccbcIntakeNumber}
                  intake={intake.node}
                  currentIntakeNumber={openIntake?.ccbcIntakeNumber}
                />
              );
            })}
          </section>
        )}
        <AddIntake />
      </StyledContainer>
    </Layout>
  );
};

export default withRelay(
  ApplicationIntakes,
  getApplicationIntakesQuery,
  defaultRelayOptions
);
