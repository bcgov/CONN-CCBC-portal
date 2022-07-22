import Link from 'next/link';
import { withRelay, RelayProps } from 'relay-nextjs';
import { NextPageContext } from 'next/types';
import { getSessionQuery } from '../../../schema/queries';
import defaultRelayOptions from '../../../lib/relay/withRelayOptions';
import { usePreloadedQuery } from 'react-relay/hooks';
import { isAuthenticated } from '@bcgov-cas/sso-express/dist/helpers';
import type { Request } from 'express';
import Button from '@button-inc/bcgov-theme/Button';
import SuccessBanner from '../../../components/Form/SuccessBanner';
import styled from 'styled-components';
import { Layout } from '../../../components';

const StyledSection = styled.section`
  margin: 24px 0;
`;

const StyledDiv = styled.div`
  margin: 24px;
`;

const Success = ({ preloadedQuery }: any) => {
  const { session }: any = usePreloadedQuery(getSessionQuery, preloadedQuery);

  return (
    <Layout session={session} title="Connecting Communities BC">
      <StyledDiv>
        <StyledSection>
          <SuccessBanner />
          <h3>Thank you for applying to CCBC Intake 1</h3>
          <div>We have received your application for Sudden Valley.</div>
          <div>
            You can edit this application until the intake closes on YYYY/MM/DD.
          </div>
        </StyledSection>
        <Link href="/" passHref>
          <Button>Return to dashboard</Button>
        </Link>
      </StyledDiv>
    </Layout>
  );
};

const QueryRenderer = ({ preloadedQuery }: RelayProps) => {
  return (
    preloadedQuery && <Success preloadedQuery={preloadedQuery} CSN={false} />
  );
};

export const withRelayOptions = {
  ...defaultRelayOptions,
  serverSideProps: async (ctx: NextPageContext) => {
    // Server-side redirection of the user to their landing route, if they are logged in
    const request = ctx.req as Request;
    const authenticated = isAuthenticated(request);
    // They're logged in.
    if (authenticated) {
      return {};
    }
    // Handle not logged in
    return {
      redirect: {
        destination: '/',
      },
    };
  },
};

export default withRelay(QueryRenderer, getSessionQuery, withRelayOptions);
