import { useRouter } from 'next/router';
import Link from 'next/link';

import { withRelay, RelayProps } from 'relay-nextjs';
import { NextPageContext } from 'next/types';
import {
  getAllApplicationsByOwnerQuery,
  getSessionQuery,
} from '../schema/queries';
import defaultRelayOptions from '../lib/relay/withRelayOptions';
import {
  PreloadedQuery,
  useLazyLoadQuery,
  usePreloadedQuery,
} from 'react-relay/hooks';
import { isAuthenticated } from '@bcgov-cas/sso-express/dist/helpers';
import type { Request } from 'express';

import StyledGovButton from '../components/StyledGovButton';
import { useCreateApplicationMutation } from '../schema/mutations/application/createApplication';
import { Layout } from '../components';
import { DashboardTable } from '../components/Dashboard';
import { getAllApplicationsByOwnerQuery as getAllApplicationsByOwnerQueryType } from '../__generated__/getAllApplicationsByOwnerQuery.graphql';
import { getSessionQuery as getSessionQueryType} from '../__generated__/getSessionQuery.graphql';

const Dashboard = ({ preloadedQuery }: any) => {
  const { session }: any = usePreloadedQuery(getSessionQuery, preloadedQuery);
  const trimmedSub: string = session?.sub.replace(/-/g, '');

  const allApplications = useLazyLoadQuery<getAllApplicationsByOwnerQueryType>(
    getAllApplicationsByOwnerQuery,
    {
      formOwner: { owner: trimmedSub },
    }
  );

  const router = useRouter();

  const [createApplication] = useCreateApplicationMutation();

  const handleCreateApplication = () => {
    createApplication({
      variables: {
        // input: { application: { owner: session?.sub } },
        input: { application: { owner: trimmedSub } },
      },
      onCompleted: (response) => {
        const applicationId = response.createApplication.application.rowId;
        router.push(`/form/${applicationId}/1`);
      },
      onError: () => {
        // This needs to be removed once application dashboard implemented
        router.push('/dashboard');
      },
    });
  };
  return (
    <Layout session={session} title="Connecting Communities BC">
      <div>
        <h1>Dashboard</h1>
        <StyledGovButton onClick={handleCreateApplication}>
          New application
        </StyledGovButton>
        <h4>No applications yet</h4>
        <p>Start a new application; applications will appear here</p>
      </div>
      <DashboardTable applications={allApplications} />
    </Layout>
  );
};

const QueryRenderer = ({ preloadedQuery }: RelayProps) => {
  return (
    preloadedQuery && <Dashboard preloadedQuery={preloadedQuery} CSN={false} />
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
