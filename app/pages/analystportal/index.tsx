import { usePreloadedQuery } from 'react-relay/hooks';
import { withRelay, RelayProps } from 'relay-nextjs';
import { graphql } from 'react-relay';
import styled from 'styled-components';
import defaultRelayOptions from '../../lib/relay/withRelayOptions';
import { ButtonLink, Layout, LoginForm } from '../../components';
import { analystportalQuery } from '../../__generated__/analystportalQuery.graphql';

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

const getAnalystportalQuery = graphql`
  query analystportalQuery {
    session {
      sub
    }
  }
`;

const Home = ({
  preloadedQuery,
}: RelayProps<Record<string, unknown>, analystportalQuery>) => {
  const { session } = usePreloadedQuery(getAnalystportalQuery, preloadedQuery);

  return (
    <Layout session={session} title="Connecting Communities BC">
      <div>
        <h1>CCBC Analyst login</h1>

        <section>
          <p>
            NetworkBC members with access to Connecting Communities BC (CCBC)
            applications may log in with their IDIR.
          </p>

          {session?.sub ? (
            <StyledBtnContainer>
              <ButtonLink href="/analystportal/dashboard">
                Go to dashboard
              </ButtonLink>
            </StyledBtnContainer>
          ) : (
            <StyledBtnContainer>
              <LoginForm idp="IDIR" />
            </StyledBtnContainer>
          )}
          <p>If you do not have access, please contact your administrator</p>
        </section>
      </div>
    </Layout>
  );
};

export const withRelayOptions = {
  ...defaultRelayOptions,
  serverSideProps: async () => ({}),
};

export default withRelay(Home, getAnalystportalQuery, withRelayOptions);
