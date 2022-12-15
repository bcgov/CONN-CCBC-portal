import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { withRelay, RelayProps } from 'relay-nextjs';
import { usePreloadedQuery } from 'react-relay/hooks';
import { graphql } from 'react-relay';
import dateTimeSubtracted from 'utils/dateTimeSubtracted';
import styled from 'styled-components';
import Link from '@button-inc/bcgov-theme/Link';
import { useFeature } from '@growthbook/growthbook-react';
import defaultRelayOptions from '../../lib/relay/withRelayOptions';
import StyledGovButton from '../../components/StyledGovButton';
import { useCreateApplicationMutation } from '../../schema/mutations/application/createApplication';
import { DynamicAlert, Layout } from '../../components';
import { DashboardTable } from '../../components/Dashboard';
import { dashboardQuery } from '../../__generated__/dashboardQuery.graphql';

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
        formData {
          lastEditedPage
          isEditable
        }
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
    nextIntake {
      openTimestamp
    }
  }
`;

const StyledContainer = styled('div')`
  margin: 0 auto;
  width: 100%;
`;

const Dashboard = ({
  preloadedQuery,
}: RelayProps<Record<string, unknown>, dashboardQuery>) => {
  const query = usePreloadedQuery(getDashboardQuery, preloadedQuery);
  const { allApplications, nextIntake, openIntake, session } = query;

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
        router.push(`/applicantportal/form/${applicationId}/1`);
      },
      onError: () => {
        // This needs to be removed once application dashboard implemented
        router.push('/');
      },
    });
  };

  const openIntakeBanner = useFeature('open_intake_alert').value || {};
  const closedIntakeBanner = useFeature('closed_intake_alert').value || {};
  const showSubtractedTime = useFeature('show_subtracted_time').value || 0;

  return (
    <Layout session={session} title="Connecting Communities BC">
      <StyledContainer>
        <section>
          {openIntake && (
            <DynamicAlert
              dateTimestamp={closeTimestamp}
              text={openIntakeBanner.text}
              variant={openIntakeBanner.variant}
              displayOpenDate={false}
            />
          )}
          {!openIntake && (
            <DynamicAlert
              dateTimestamp={nextIntake?.openTimestamp}
              text={closedIntakeBanner.text}
              variant={closedIntakeBanner.variant}
              displayOpenDate={closedIntakeBanner.displayOpenDate}
            />
          )}
          <h1>Dashboard</h1>
          {openIntake ? (
            <p>
              Review of applications will begin on{' '}
              {dateTimeSubtracted(closeTimestamp, showSubtractedTime)}. You can
              edit draft and submitted applications until this date.
            </p>
          ) : (
            <div>
              <p>Applications are currently not being accepted.</p>
              <p>
                Please check the{' '}
                <Link
                  href="https://www2.gov.bc.ca/gov/content/governments/connectivity-in-bc/20601/20601-63737"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  program webpage
                </Link>{' '}
                for updates.
              </p>
            </div>
          )}
          <StyledGovButton
            onClick={handleCreateApplication}
            disabled={!openIntake}
          >
            Create application
          </StyledGovButton>
        </section>
        <section>
          {hasApplications ? (
            <DashboardTable applications={query} />
          ) : (
            <p>Applications will appear here</p>
          )}
        </section>
      </StyledContainer>
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
