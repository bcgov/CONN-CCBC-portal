import { usePreloadedQuery } from 'react-relay/hooks';
import { withRelay, RelayProps } from 'relay-nextjs';
import { graphql } from 'react-relay';
import { useFeature } from '@growthbook/growthbook-react';
import Link from '@button-inc/bcgov-theme/Link';
import styled from 'styled-components';
import { Button } from '@button-inc/bcgov-theme'; 
import defaultRelayOptions from '../lib/relay/withRelayOptions';
import { ButtonLink, DynamicAlert, Layout, LoginForm } from '../components';
import { pagesQuery } from '../__generated__/pagesQuery.graphql'; 

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

const getPagesQuery = graphql`
  query pagesQuery {
    session {
      sub
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
}: RelayProps<Record<string, unknown>, pagesQuery>) => {
  const { nextIntake, openIntake, session } = usePreloadedQuery(
    getPagesQuery,
    preloadedQuery
  );

  const openIntakeBanner = useFeature('open_intake_alert').value || {};
  const closedIntakeBanner = useFeature('closed_intake_alert').value || {}; 

  return (
    <Layout session={session} title="Connecting Communities BC">
      <div>
        <h1>Welcome</h1>
        <section>
          <>
          Refer to{' '}
          <Link href="https://www.gov.bc.ca/connectingcommunitiesbc">
            program details
          </Link>{' '}
          for the application materials and full information about the
          Connecting Communities British Columbia (CCBC) program.
          {!openIntake && (
            <DynamicAlert dateTimestamp={nextIntake?.openTimestamp} text={closedIntakeBanner.text}
            variant={closedIntakeBanner.variant} includeLink 
            displayOpenDate = {closedIntakeBanner.displayOpenDate}/>        
          )}
          {openIntake && (
            <DynamicAlert dateTimestamp={openIntake.closeTimestamp} text={openIntakeBanner.text}
            variant={openIntakeBanner.variant} includeLink={false} displayOpenDate={false} />
          )}
          </>
        </section>
        <section>
          {session?.sub ? (
            <StyledBtnContainer>
              <ButtonLink href="/dashboard">Go to dashboard</ButtonLink>
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
  serverSideProps: async () => ({}),
};

export default withRelay(Home, getPagesQuery, withRelayOptions);
