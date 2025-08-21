import { useRouter } from 'next/router';
import { usePreloadedQuery, graphql } from 'react-relay';
import { withRelay, RelayProps } from 'relay-nextjs';
import defaultRelayOptions from 'lib/relay/withRelayOptions';
import { ButtonLink, Layout } from 'components';
import { AnalystLayout } from 'components/Analyst';
import RFI from 'components/Analyst/RFI/RFI';
import { rfiQuery } from '__generated__/rfiQuery.graphql';
import GuideLink from 'components/Analyst/GuideLink';
import styled from 'styled-components';

const GuideContainer = styled.div`
  padding-bottom: ${(props) => props.theme.spacing.small};
`;

const getRfiQuery = graphql`
  query rfiQuery($rowId: Int!) {
    applicationByRowId(rowId: $rowId) {
      applicationRfiDataByApplicationId(orderBy: RFI_DATA_ID_DESC) {
        edges {
          node {
            rfiDataByRfiDataId {
              id
              archivedAt
              ...RFI_query
            }
          }
        }
      }
    }
    session {
      sub
    }
    ...AnalystLayout_query
  }
`;

const RFIPage = ({
  preloadedQuery,
}: RelayProps<Record<string, unknown>, rfiQuery>) => {
  const query = usePreloadedQuery(getRfiQuery, preloadedQuery);
  const { applicationByRowId, session } = query;
  const router = useRouter();
  const { applicationId } = router.query;

  const rfiList =
    applicationByRowId.applicationRfiDataByApplicationId.edges?.map(
      ({ node }) => node.rfiDataByRfiDataId
    );
  return (
    <Layout session={session} title="Connecting Communities BC">
      <AnalystLayout query={query}>
        <h2>RFI</h2>
        <hr />
        <GuideContainer>
          <GuideLink />
        </GuideContainer>
        <ButtonLink href={`/analyst/application/${applicationId}/rfi/0`}>
          New RFI
        </ButtonLink>
        <>
          {rfiList?.map((rfi) => {
            const { archivedAt } = rfi;
            // not a fan of this solution, but can't filter through graphql
            if (archivedAt === null) {
              return (
                <RFI
                  key={rfi.id}
                  rfiDataByRfiDataId={rfi}
                  id={rfi.id as string}
                />
              );
            }
            return null;
          })}
        </>
      </AnalystLayout>
    </Layout>
  );
};

export const withRelayOptions = {
  ...defaultRelayOptions,

  variablesFromContext: (ctx) => {
    return {
      rowId: parseInt(ctx.query.applicationId.toString(), 10),
    };
  },
};

export default withRelay(RFIPage, getRfiQuery, withRelayOptions);
