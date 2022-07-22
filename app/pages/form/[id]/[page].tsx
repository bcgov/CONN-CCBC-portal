import { useRouter } from 'next/router';
import { ApplicationForm, Back } from '../../../components/Form';
import { withRelay, RelayProps } from 'relay-nextjs';
import { NextPageContext } from 'next/types';
import { getSessionQuery } from '../../../schema/queries';
import defaultRelayOptions from '../../../lib/relay/withRelayOptions';
import { usePreloadedQuery } from 'react-relay/hooks';
import { isAuthenticated } from '@bcgov-cas/sso-express/dist/helpers';
import type { Request } from 'express';
import FormDiv from '../../../components/FormDiv';
//TODO: Change to getApplicationById
import { getApplicationByIdQuery } from '../../../schema/queries';
import { getApplicationByIdQuery as getApplicationByIdQueryType } from '../../../__generated__/getApplicationByIdQuery.graphql';
import { useLazyLoadQuery } from 'react-relay';
import { Layout } from '../../../components';
import styled from 'styled-components';

const AppNamedDiv = styled('div')`
  float: right;
  max-width: 80px;
  white-space: nowrap;
  font-weight: bold;
`;

const FormPage = ({ preloadedQuery }: any) => {
  const { session }: any = usePreloadedQuery(getSessionQuery, preloadedQuery);

  const router = useRouter();
  const trimmedSub = session?.sub.replace(/-/g, '');

  const applicationId = Number(router.query.id);

  const application = useLazyLoadQuery<getApplicationByIdQueryType>(
    getApplicationByIdQuery,
    {
      applicationId: applicationId,
    }
  );

  const trimApptitle = (title:string) => {
    if (!title) return;
    if(title.length>33) return `${title.substring(0,30)}...`;
    return title;
  }

  const formData = application.applicationByRowId?.formData
  const pageNumber = Number(router.query.page);
  const appTitle = formData?.projectInformation?.projectTitle;
  const appTitleTrimmed = trimApptitle(appTitle);

  return (
    <Layout session={session} title="Connecting Communities BC">
      <FormDiv>
        <AppNamedDiv>{appTitleTrimmed}</AppNamedDiv>
        <Back applicationId={applicationId} pageNumber={pageNumber} />
        <ApplicationForm
          formData={formData || {}}
          pageNumber={pageNumber}
          trimmedSub={trimmedSub}
          applicationId={applicationId}
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
