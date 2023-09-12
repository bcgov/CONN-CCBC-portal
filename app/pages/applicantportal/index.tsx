import type { NextPageContext } from 'next';
import { useRouter } from 'next/router'; 
import { usePreloadedQuery } from 'react-relay/hooks';
import { withRelay, RelayProps } from 'relay-nextjs';
import { graphql } from 'react-relay';
import crypto from 'crypto';
import { useFeature } from '@growthbook/growthbook-react';
import Link from '@button-inc/bcgov-theme/Link';
import styled from 'styled-components';
import { useMemo } from 'react';
import { Button, Callout } from '@button-inc/bcgov-theme';
import dateTimeSubtracted from 'utils/dateTimeSubtracted';
import { ButtonLink, DynamicAlert, Layout, LoginForm } from '../../components';
import defaultRelayOptions from '../../lib/relay/withRelayOptions';
import { applicantportalQuery } from '../../__generated__/applicantportalQuery.graphql';

const StyledOl = styled('ol')`
  max-width: 300px;
`;

const StyledLi = styled('li')`
  display: flex;
  justify-content: space-between;
`;

const StyledDetails = styled('div')`
  color: rgba(45, 45, 45, 0.7);
  min-width: 80px;
`;

const StyledBtnContainer = styled('div')`
  display: flex;
  width: fit-content;
  flex-direction: column;
  margin: ${(props) => props.theme.spacing.large} 0;
  padding: ${(props) => props.theme.spacing.large};
  gap: ${(props) => props.theme.spacing.medium};
  border: 1px solid #d9d9d9;
  border-radius: 8px;
`;

const BasicBCeIDFlex = styled('div')`
  display: inline-flex;
  gap: ${(props) => props.theme.spacing.xlarge};
`;

// while a `strong` element may be displayed as bold,
// that should not be relied upon and font-weight should be used instead.
// Using a `strong` element is still useful on a semantic level.
const BoldText = styled('strong')`
  font-weight: bold;
`;

const StyledCallout = styled(Callout)`
  margin: ${(props) => props.theme.spacing.medium} 0;
`;

const getApplicantportalQuery = graphql`
  query applicantportalQuery {
    session {
      sub
    }
    openIntakePublic {
      openTimestamp
      closeTimestamp
    }
    openIntake {
      openTimestamp
      closeTimestamp
    }
    nextIntake {
      openTimestamp
    }
  }
`;

const Home = ({
  preloadedQuery,
}: RelayProps<Record<string, unknown>, applicantportalQuery>) => {
  const { nextIntake, openIntake, openIntakePublic, session } = usePreloadedQuery(
    getApplicantportalQuery,
    preloadedQuery
  );
  const { asPath } = useRouter();
  const queryParams = asPath.replace('applicantportal',''); 
  let custom;
  if (queryParams !== '') {
    crypto.createHash('sha256');
    const hash = crypto.createHash('sha256');
    const secret = queryParams.replace('/','').replace('?','').replace('=','');
    hash.update(secret);
    const digest = hash.digest('hex');
    custom = digest === '32783cef30bc23d9549623aa48aa8556346d78bd3ca604f277d63d6e573e8ce0';
  }

  let intakeDates = custom 
    ? (openIntake ? {...openIntake} : openIntake)
    : (openIntakePublic ? {...openIntakePublic} : openIntakePublic);
   
  const openIntakeBanner = useFeature('open_intake_alert').value || {};
  const closedIntakeBanner = useFeature('closed_intake_alert').value || {};
  const showSubtractedTime = useFeature('show_subtracted_time').value || 0;

  const intakeCalloutChildren = useMemo(() => {
    if (!intakeDates)
      return (
        <>
          <BoldText>Applications are not currently being accepted.</BoldText>
          <br />
          Please check the{' '}
          <Link href="https://www.gov.bc.ca/connectingcommunitiesbc">
            program webpage
          </Link>{' '}
          for updates.
        </>
      );

    const formattedClosingDate = dateTimeSubtracted(
      intakeDates.closeTimestamp,
      showSubtractedTime
    );

    return (
      <BoldText>
        {`Applications are accepted until ${formattedClosingDate}.`}
        <br />
        Review of applications will not begin until this date. Draft and
        submitted applications can be edited until then.
      </BoldText>
    );
  }, [intakeDates]);
  const dashboardUrl = `/applicantportal/dashboard${queryParams}`;
  return (
    <Layout session={session} title="Connecting Communities BC">
      <div>
        {!intakeDates && (
          <DynamicAlert
            dateTimestamp={nextIntake?.openTimestamp}
            text={closedIntakeBanner.text}
            variant={closedIntakeBanner.variant}
            displayOpenDate={closedIntakeBanner.displayOpenDate}
          />
        )}
        {intakeDates && (
          <DynamicAlert
            dateTimestamp={intakeDates.closeTimestamp}
            text={openIntakeBanner.text}
            variant={openIntakeBanner.variant}
            displayOpenDate={false}
          />
        )}
        <h1>Welcome</h1>
        <section>
          Refer to{' '}
          <Link href="https://www.gov.bc.ca/connectingcommunitiesbc">
            program details
          </Link>{' '}
          for the application materials and full information about the
          Connecting Communities British Columbia (CCBC) program.
          <StyledCallout>{intakeCalloutChildren}</StyledCallout>
        </section>
        <section>
          {session?.sub ? (
            <StyledBtnContainer>
              <ButtonLink href={dashboardUrl}>
                Go to dashboard
              </ButtonLink>
            </StyledBtnContainer>
          ) : (
            <>
              <StyledBtnContainer>
                <span>Do you have a Business BCeID?</span>
                <LoginForm idp="Business BCeID" />
              </StyledBtnContainer>
              <StyledBtnContainer>
                <span>If you do not have a Business BCeID:</span>
                <BasicBCeIDFlex>
                  <LoginForm idp="Basic BCeID" />
                  <a href="https://www.bceid.ca/os/?7770&SkipTo=Basic">
                    <Button variant="secondary">
                      Register for Basic BCeID
                    </Button>
                  </a>
                </BasicBCeIDFlex>
              </StyledBtnContainer>
            </>
          )}
        </section>

        <section>
          <h3>Application form overview</h3>
          <p>
            Your responses will save automatically, you may exit and return at
            any time.
          </p>
          <p>All questions are mandatory unless indicated otherwise.</p>
          <StyledOl>
            <StyledLi>
              Project details <StyledDetails>10 pages</StyledDetails>
            </StyledLi>
            <StyledLi>
              Attachment uploads <StyledDetails>3 pages</StyledDetails>
            </StyledLi>
            <StyledLi>
              Organization details <StyledDetails>5 pages</StyledDetails>
            </StyledLi>
            <StyledLi>
              Acknowledgements <StyledDetails>1 page</StyledDetails>
            </StyledLi>
          </StyledOl>
        </section>

        <section>
          <h3>General information</h3>
          <ul>
            <li>
              Applicants can apply for multiple projects and technology types
              but must demonstrate satisfaction of the required qualifications
              for each project.
            </li>
            <li>
              Subject to the terms of the Application Guide, no information
              which is marked Proprietary or Confidential that is submitted by
              an applicant during the application process will be disclosed to a
              Third Party by the Ministry, unless otherwise authorized by the
              applicant or if required to be disclosed by law.
            </li>
            <li>
              Any document or content submitted as part of the application
              process shall be deemed and remain the property of the Province of
              B.C. and is subject to the B.C. Freedom of Information and
              Protection of Privacy Act.
            </li>
            <li>
              CCBC is a program jointly funded by Canada and British Columbia.
              Applications selected by CCBC may be funded by both the Province
              and Innovation, Science and Economic Development Canada&lsquo;s
              (ISED) Universal Broadband Fund (UBF). Despite the streamlined
              application process, ISED has its own decision-making process and
              the Province does not represent ISED or make determinations
              regarding the UBF.
            </li>
          </ul>
        </section>
      </div>
    </Layout>
  );
};

export const withRelayOptions = {
  ...defaultRelayOptions,
  serverSideProps: async (ctx: NextPageContext) => {
    const { default: getAuthRole } = await import('../../utils/getAuthRole');

    const request = ctx.req as any;
    const authRole = getAuthRole(request);
    const pgRole = authRole?.pgRole;
    const isAnalyst = pgRole === 'ccbc_admin' || pgRole === 'ccbc_analyst';

    // Redirect signed in analysts to the analyst landing page
    if (isAnalyst) {
      return {
        redirect: {
          destination: authRole.landingRoute,
        },
      };
    }

    return {};
  },
};

export default withRelay(Home, getApplicantportalQuery, withRelayOptions);
