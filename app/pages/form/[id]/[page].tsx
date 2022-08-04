import { useRouter } from 'next/router';
import { ApplicationForm, Back } from '../../../components/Form';
import { withRelay, RelayProps } from 'relay-nextjs';
import { graphql } from 'react-relay';
import defaultRelayOptions from '../../../lib/relay/withRelayOptions';
import { usePreloadedQuery } from 'react-relay/hooks';
import FormDiv from '../../../components/FormDiv';
import { Layout } from '../../../components';
import styled from 'styled-components';

const AppNamedDiv = styled('div')`
  float: right;
  max-width: 80px;
  white-space: nowrap;
  font-weight: bold;
`;
import { PageQuery } from '../../../__generated__/PageQuery.graphql';

const getPageQuery = graphql`
  query PageQuery($rowId: Int!) {
    applicationByRowId(rowId: $rowId) {
      formData
      id
      owner
      referenceNumber
      status
    }
    session {
      sub
    }
  }
`;

// eslint-disable-next-line @typescript-eslint/ban-types
const FormPage = ({ preloadedQuery }: RelayProps<{}, PageQuery>) => {
  const query = usePreloadedQuery(getPageQuery, preloadedQuery);

  const { applicationByRowId, session } = query;

  const router = useRouter();
  const trimmedSub = session?.sub.replace(/-/g, '');

  const applicationId = Number(router.query.id);

  const trimApptitle = (title: string) => {
    if (!title) return;
    if (title.length > 33) return `${title.substring(0, 30)}...`;
    return title;
  };

  const formData = applicationByRowId?.formData;
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
          status={applicationByRowId.status}
        />
      </FormDiv>
    </Layout>
  );
};

export const withRelayOptions = {
  ...defaultRelayOptions,

  variablesFromContext: (ctx) => {
    return {
      rowId: parseInt(ctx.query.id.toString()),
    };
  },
};

export default withRelay(FormPage, getPageQuery, withRelayOptions);
