import { useState } from 'react';
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
    allIntakes(
      first: 999
      orderBy: CCBC_INTAKE_NUMBER_DESC
      condition: { archivedAt: null }
    ) @connection(key: "ApplicationIntakes_allIntakes") {
      __id
      edges {
        node {
          __id
          ccbcIntakeNumber
          description
          closeTimestamp
          openTimestamp
          rowId

          ...Intake_query
        }
      }
    }
    openIntake {
      ccbcIntakeNumber
    }
    ...AddIntake_query
    session {
      sub
      ...DashboardTabs_query
    }
  }
`;

const StyledContainer = styled.div`
  width: 100%;
`;

const ApplicationIntakes = ({
  preloadedQuery,
}: RelayProps<Record<string, unknown>, applicationIntakesQuery>) => {
  const query = usePreloadedQuery(getApplicationIntakesQuery, preloadedQuery);
  const { allIntakes, openIntake, session } = query;

  const latestIntake = allIntakes?.edges[0].node;
  const newIntakeNumber = ((latestIntake?.ccbcIntakeNumber as number) || 0) + 1;

  const [isFormEditMode, setIsFormEditMode] = useState(false);

  const [formData, setFormData] = useState({
    intakeNumber: newIntakeNumber,
  } as any);

  const intakeList =
    allIntakes &&
    [...allIntakes.edges].filter((data) => {
      // filter null to handle errors after delting connection
      return data.node !== null;
    });

  const handleEdit = (intake) => {
    const {
      __id: id,
      ccbcIntakeNumber,
      closeTimestamp,
      description,
      openTimestamp,
      rowId,
    } = intake;
    setIsFormEditMode(true);
    setFormData({
      id,
      intakeNumber: ccbcIntakeNumber,
      startDate: openTimestamp,
      endDate: closeTimestamp,
      description,
      rowId,
    });
  };

  return (
    <Layout session={session} title="Connecting Communities BC">
      <StyledContainer>
        <DashboardTabs session={session} />
        <AdminTabs />
        <section>
          <h2>Application Intakes</h2>
          <p>
            All times are in Pacific Time and automatically adjusted for
            daylight saving time where necessary.
          </p>
          <p>Applicants have a grace period after each deadline.</p>
          <p>
            To adjust the grace period or toggle visibility of upcoming intake
            dates, go to https://app.growthbook.io/
          </p>
        </section>
        <AddIntake
          applicationQuery={query}
          formData={formData}
          intakeList={intakeList}
          isFormEditMode={isFormEditMode}
          setFormData={setFormData}
          setIsFormEditMode={setIsFormEditMode}
        />
        {intakeList && (
          <section>
            {intakeList.map((intake: any) => {
              return (
                <Intake
                  key={intake?.node?.ccbcIntakeNumber}
                  allIntakesConnectionId={allIntakes.__id}
                  intake={intake.node}
                  currentIntakeNumber={openIntake?.ccbcIntakeNumber}
                  isFormEditMode={isFormEditMode}
                  onEdit={() => handleEdit(intake.node)}
                  setIsFormEditMode={setIsFormEditMode}
                />
              );
            })}
          </section>
        )}
      </StyledContainer>
    </Layout>
  );
};

export default withRelay(
  ApplicationIntakes,
  getApplicationIntakesQuery,
  defaultRelayOptions
);
