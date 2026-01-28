import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { withRelay, RelayProps } from 'relay-nextjs';
import { usePreloadedQuery, graphql } from 'react-relay';
import dateTimeSubtracted from 'utils/dateTimeSubtracted';
import styled from 'styled-components';
import Link from '@button-inc/bcgov-theme/Link';
import { useFeature } from '@growthbook/growthbook-react';
import defaultRelayOptions from 'lib/relay/withRelayOptions';
import StyledGovButton from 'components/StyledGovButton';
import { useCreateApplicationMutation } from 'schema/mutations/application/createApplication';
import { DynamicAlert, Layout } from 'components';
import { DashboardTable } from 'components/Dashboard';
import { dashboardQuery } from '__generated__/dashboardQuery.graphql';

const getDashboardQuery = graphql`
  query dashboardQuery($formOwner: ApplicationCondition!, $code: String!) {
    allApplications(
      condition: $formOwner
      orderBy: CREATED_AT_DESC
      first: 1000
    ) @connection(key: "dashboard_allApplications") {
      __id
      edges {
        node {
          id
          archivedAt
          archivedBy
          rowId
          owner
          status
          projectName
          ccbcNumber
          formData {
            lastEditedPage
            isEditable
            formByFormSchemaId {
              jsonSchema
            }
          }
          intakeByIntakeId {
            ccbcIntakeNumber
            closeTimestamp
            openTimestamp
          }
          hasRfiOpen
          rfi {
            rowId
          }
        }
      }
    }
    session {
      sub
      ccbcUserBySub {
        intakeUsersByUserId {
          nodes {
            intakeId
          }
        }
      }
    }
    openIntake {
      rowId
      ccbcIntakeNumber
      closeTimestamp
      rollingIntake
      hidden
      hiddenCode
    }
    nextIntake {
      openTimestamp
    }
    openHiddenIntake(code: $code) {
      id
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
  const { allApplications, nextIntake, openIntake, session, openHiddenIntake } =
    query;
  const hasIntakeAccess =
    session?.ccbcUserBySub?.intakeUsersByUserId?.nodes.some(
      (node) => node.intakeId === openIntake?.rowId
    );

  const closeTimestamp = openIntake?.closeTimestamp;
  const isRollingIntake = openIntake?.rollingIntake ?? false;
  const isInviteOnlyIntake = !!openIntake?.hiddenCode && !openIntake?.hidden;
  const intakeLabel = openIntake?.ccbcIntakeNumber
    ? `Intake ${openIntake.ccbcIntakeNumber}`
    : 'The intake';

  const isInternalIntakeEnabled = useFeature('internal_intake').value ?? false;
  const [isApplicationCreated, setIsApplicationCreated] = useState(false);

  // Disable intake if user does not have access to invite only intake
  const disableIntake = isInviteOnlyIntake && !hasIntakeAccess;

  const sub: string = session?.sub;

  const hasApplications = allApplications.edges.length > 0;

  const router = useRouter();

  const [createApplication, isCreating] = useCreateApplicationMutation();

  // We want the button disabled if there's no open intake and if there isn't an internal intake open or if it's been disabled
  // Additionally, if the applicant is creating an application or has succeeded in creating an application then the button is disabled to prevent clicking multiple times
  const isCreateApplicationDisabled =
    (!openIntake && (!openHiddenIntake || !isInternalIntakeEnabled)) ||
    isCreating ||
    // This is necessary since the router.push() is client side, so if there is a slow connection the applicant will still be able to create an application while the new page is loading
    isApplicationCreated;

  useEffect(() => {
    // check if session is still valid
    if (!sub) router.push('/');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreateApplication = () => {
    if (openIntake || (openHiddenIntake && isInternalIntakeEnabled)) {
      createApplication({
        variables: {
          input: {
            code: (router.query.code as string) ?? '',
          },
        },
        onCompleted: (response) => {
          const applicationId = response.createApplication.application.rowId;
          router.push(`/applicantportal/form/${applicationId}/1`);
          setIsApplicationCreated(true);
        },
        onError: () => {
          // This needs to be removed once application dashboard implemented
          router.push('/');
        },
      });
    }
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
              {isRollingIntake ? (
                <>
                  {intakeLabel} is now open until{' '}
                  {dateTimeSubtracted(closeTimestamp, showSubtractedTime)}. If
                  you are interested in submitting an application, or for any
                  questions about connectivity projects in your area, please
                  email{' '}
                  <a href="mailto:connectingcommunitiesbc@gov.bc.ca">
                    connectingcommunitiesbc@gov.bc.ca
                  </a>
                </>
              ) : (
                `Review of applications will begin on
              ${dateTimeSubtracted(closeTimestamp, showSubtractedTime)}. You can
              edit draft and submitted applications until this date.`
              )}
            </p>
          ) : (
            <div>
              <p>Applications are currently not being accepted.</p>
              <p>
                Please check the{' '}
                <Link
                  href="https://www.gov.bc.ca/connectingcommunitiesbc"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  program webpage
                </Link>{' '}
                for updates.
              </p>
            </div>
          )}
          {!disableIntake ? (
            <StyledGovButton
              onClick={handleCreateApplication}
              disabled={isCreateApplicationDisabled || disableIntake}
            >
              Create application
            </StyledGovButton>
          ) : (
            <StyledGovButton
              onClick={() => {
                window.location.href =
                  'mailto:connectingcommunitiesbc@gov.bc.ca@gov.bc.ca';
              }}
            >
              Email Us
            </StyledGovButton>
          )}
        </section>
        <section>
          {hasApplications ? (
            <DashboardTable applications={query} editEnabled={!disableIntake} />
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
    const code: string = ctx?.query?.code ?? '';

    return {
      formOwner: { owner: sub, archivedAt: null, archivedBy: null },
      code,
    };
  },
};

export default withRelay(Dashboard, getDashboardQuery, withRelayOptions);
