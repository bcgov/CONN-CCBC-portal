import { LoginForm } from '../components';
import { usePreloadedQuery } from 'react-relay/hooks';
import { withRelay, RelayProps } from 'relay-nextjs';
import defaultRelayOptions from '../lib/relay/withRelayOptions';
import { isAuthenticated } from '@bcgov-cas/sso-express/dist/helpers';
import type { Request } from 'express';
import { ButtonLink, Layout } from '../components';
import { NextPageContext } from 'next/types';
import { getSessionQuery } from '../schema/queries';

const Home = ({ preloadedQuery }: RelayProps) => {
  const { session }: any = usePreloadedQuery(getSessionQuery, preloadedQuery);

  return (
    <Layout session={session} title="Connecting Communities BC">
      <div>
        <h1>Welcome</h1>
        <p>General information:</p>
        <ul>
          <li>Please read the Application Guide.</li>
          <li>Please fill out all templates before completing application</li>
          <li>
            Applicants can apply for multiple projects and technology types but
            must demonstrate the required qualifications for each.
          </li>
        </ul>
        <p>
          To begin the application, please log in with BCeID Business. If you do
          not have BCeID Business, please use your BCeID Basic.
        </p>

        {session?.sub ? (
          <ButtonLink href="/dashboard">Go to dashboard</ButtonLink>
        ) : (
          <LoginForm />
        )}
      </div>
    </Layout>
  );
};

// Todo: look for a better way to handle preloadedQuery error. Using this to wait until
// preloadedQuery exists to load page to fix crash if no session
const QueryHandler = ({ preloadedQuery }: RelayProps) => {
  return preloadedQuery && <Home preloadedQuery={preloadedQuery} CSN={false} />;
};

export const withRelayOptions = {
  ...defaultRelayOptions,
  serverSideProps: async (ctx: NextPageContext) => {
    // Server-side redirection of the user to their landing route, if they are logged in
    const request = ctx.req as Request;
    const authenticated = isAuthenticated(request);
    // They're logged in.
    // Disable for index
    if (authenticated) {
      //   return {
      //     redirect: {
      //       destination: '/dashboard',
      //     },
      return {};
    }
    // Handle not logged in
    return {};
  },
};

export default withRelay(QueryHandler, getSessionQuery, withRelayOptions);
