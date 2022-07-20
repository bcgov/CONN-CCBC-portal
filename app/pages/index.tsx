import { LoginForm } from '../components';
import { usePreloadedQuery } from 'react-relay/hooks';
import { withRelay, RelayProps } from 'relay-nextjs';
import defaultRelayOptions from '../lib/relay/withRelayOptions';
import { isAuthenticated } from '@bcgov-cas/sso-express/dist/helpers';
import type { Request } from 'express';
import { ButtonLink, Layout } from '../components';
import { NextPageContext } from 'next/types';
import { getSessionQuery } from '../schema/queries';
import styled from 'styled-components';

const StyledOl = styled('ol')`
  max-width: 300px;
`;

const StyledLi = styled('li')`
  display: flex;
  justify-content: space-between;
`;

const StyledDetails = styled('div')`
  color: rgba(45, 45, 45, 0.7);
`;

const Home = ({ preloadedQuery }: RelayProps) => {
  const { session }: any = usePreloadedQuery(getSessionQuery, preloadedQuery);

  return (
    <Layout session={session} title="Connecting Communities BC">
      <div>
        <h1>Welcome</h1>
        <h3>Before you begin</h3>
        <ul>
          <li>Please review the Application Guide</li>
          <li>Please review the non-fillable form</li>
          <li>
            Please review the templates and gather all supporting documents
          </li>
        </ul>
        <h3>General information</h3>
        <ul>
          <li>
            The form will autosave your responses, so you can exit and return to
            the form later
          </li>
          <li>The intake closes on MM/DD/YYYY</li>
          <li>
            Applicants can apply for multiple projects and technology types but
            must demonstrate the qualifications for each
          </li>
        </ul>
        <h3>Form section overview</h3>
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
            Declarations <StyledDetails>2 pages</StyledDetails>
          </StyledLi>
        </StyledOl>
        <h3>Get started</h3>
        <p>
          Login with BCeID Business or Basic. You can register for an account if
          you do not already have one.
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
const QueryRenderer = ({ preloadedQuery }: RelayProps) => {
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

export default withRelay(QueryRenderer, getSessionQuery, withRelayOptions);
