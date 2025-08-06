import { usePreloadedQuery, graphql } from 'react-relay';
import { withRelay, RelayProps } from 'relay-nextjs';
import styled from 'styled-components';
import defaultRelayOptions from '../../lib/relay/withRelayOptions';
import { Layout, LoginForm } from '../../components';
import { analystQuery } from '../../__generated__/analystQuery.graphql';

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

const getAnalystQuery = graphql`
  query analystQuery {
    session {
      sub
    }
  }
`;

const Home = ({
  preloadedQuery,
}: RelayProps<Record<string, unknown>, analystQuery>) => {
  const { session } = usePreloadedQuery(getAnalystQuery, preloadedQuery);

  return (
    <Layout session={session} title="Connecting Communities BC">
      <div>
        <h1>CCBC Analyst login</h1>

        <section>
          <p>
            NetworkBC members with access to Connecting Communities BC (CCBC)
            applications may log in with their IDIR.
          </p>
          <p>
            ISED members with access to Connecting Communities BC (CCBC)
            applications may log in with their Business BCeID.
          </p>
          <StyledBtnContainer>
            <LoginForm loginText="BC Gov Login" idp="IDIR" />
            <LoginForm loginText="ISED Login" idp="Business BCeID" />
          </StyledBtnContainer>
          <p>If you do not have access, please contact your administrator</p>
        </section>
      </div>
    </Layout>
  );
};

export const withRelayOptions = {
  ...defaultRelayOptions,
  serverSideProps: async (ctx) => {
    const { default: getAuthRole } = await import('../../utils/getAuthRole');
    const request = ctx.req as any;
    const isIdirUser =
      request?.claims?.identity_provider === 'idir' ||
      request?.claims?.identity_provider === 'azureidir';
    const authRole = getAuthRole(request);
    const isAuthenticatedAnalyst =
      authRole?.pgRole === 'ccbc_admin' ||
      authRole?.pgRole === 'ccbc_analyst' ||
      authRole?.pgRole === 'super_admin';

    // They're logged in and have a ccbc_admin or ccbc_analyst role
    if (isAuthenticatedAnalyst) {
      return {
        redirect: {
          destination: authRole.landingRoute,
        },
      };
    }

    // They're logged in with IDIR but don't have an authorized role
    if (isIdirUser && !isAuthenticatedAnalyst) {
      return {
        redirect: {
          destination: `/analyst/request-access`,
        },
      };
    }

    return defaultRelayOptions.serverSideProps(ctx);
  },
};

export default withRelay(Home, getAnalystQuery, withRelayOptions);
