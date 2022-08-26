import { LoginForm } from '../components';
import { usePreloadedQuery } from 'react-relay/hooks';
import { withRelay, RelayProps } from 'relay-nextjs';
import { graphql } from 'react-relay';
import defaultRelayOptions from '../lib/relay/withRelayOptions';
import { ButtonLink, Layout } from '../components';
import styled from 'styled-components';
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
  margin: 24px 0;
`;

const getPagesQuery = graphql`
  query pagesQuery {
    session {
      sub
    }
  }
`;

// eslint-disable-next-line @typescript-eslint/ban-types
const Home = ({ preloadedQuery }: RelayProps<{}, pagesQuery>) => {
  const { session } = usePreloadedQuery(getPagesQuery, preloadedQuery);

  return (
    <Layout session={session} title="Connecting Communities BC">
      <div>
        <h1>Welcome</h1>
        <section>
          <h3>Before you begin</h3>
          <ul>
            <li>
              Refer to program details for the application materials and full
              information about the Connecting Communities British Columbia
              (CCBC) program.
            </li>
          </ul>
        </section>
        <section>
          <h3>Get started</h3>
          <p>
            Login with a Business BCeID or Basic BCeID. If you do not have a
            BCeID, please register for a Basic BCeID.
          </p>
          {session?.sub ? (
            <StyledBtnContainer>
              <ButtonLink href="/dashboard">Go to dashboard</ButtonLink>
            </StyledBtnContainer>
          ) : (
            <StyledBtnContainer>
              <LoginForm />
            </StyledBtnContainer>
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
  serverSideProps: async () => {
    return {};
  },
};

export default withRelay(Home, getPagesQuery, withRelayOptions);
