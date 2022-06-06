import { useRouter } from 'next/router';
import { ApplicationForm, Back } from '../../components/Form';
import { withRelay, RelayProps } from 'relay-nextjs';
import { NextPageContext } from 'next/types';
import { getSessionQuery } from '../../schema/queries';
import defaultRelayOptions from '../../lib/relay/withRelayOptions';
import { usePreloadedQuery } from 'react-relay/hooks';
import { isAuthenticated } from '@bcgov-cas/sso-express/dist/helpers';
import type { Request } from 'express';
import FormDiv from '../../components/FormDiv';
import { getApplicationByOwnerQuery } from '../../schema/queries';
import { useLazyLoadQuery } from 'react-relay';
import { Layout } from '../../components';

const FormPage = ({ preloadedQuery }: any) => {
  const { session }: any = usePreloadedQuery(getSessionQuery, preloadedQuery);

  const router = useRouter();
  const trimmedSub = session?.sub.replace(/-/g, '');

  const application: any = useLazyLoadQuery(getApplicationByOwnerQuery, {
    owner: trimmedSub,
  });

  const formData = application?.applicationByOwner?.formData;
  const pageNumber = Number(router.query.page);

  return (
    <Layout session={session} title="Connecting Communities BC">
      <FormDiv>
        <Back pageNumber={pageNumber} />
        <ApplicationForm
          formData={formData || {}}
          pageNumber={pageNumber}
          trimmedSub={trimmedSub}
        />
      </FormDiv>
    </Layout>
  );
};

const QueryRenderer = ({ preloadedQuery }: RelayProps) => {
  return (
    preloadedQuery && <FormPage preloadedQuery={preloadedQuery} CSN={false} />
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
