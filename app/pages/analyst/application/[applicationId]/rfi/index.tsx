import { useRouter } from 'next/router';
import { usePreloadedQuery } from 'react-relay/hooks';
import { withRelay, RelayProps } from 'relay-nextjs';
import { graphql } from 'react-relay';
import defaultRelayOptions from 'lib/relay/withRelayOptions';
import { ButtonLink, Layout } from 'components';
import { AnalystLayout } from 'components/Analyst';
import RFI from 'components/Analyst/RFI/RFI';
import { rfiQuery } from '__generated__/rfiQuery.graphql';

const getRfiQuery = graphql`
  query rfiQuery($rowId: Int!) {
    applicationByRowId(rowId: $rowId) {
      applicationRfiDataByApplicationId(orderBy: RFI_DATA_ID_DESC) {
        edges {
          node {
            rfiDataByRfiDataId {
              jsonData
              rowId
              rfiNumber
              rfiDataStatusTypeByRfiDataStatusTypeId {
                name
              }
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
        <ButtonLink href={`/analyst/application/${applicationId}/rfi/0`}>
          New RFI
        </ButtonLink>
        <>
          {rfiList &&
            rfiList.map((rfi) => {
              const {
                jsonData,
                rowId,
                rfiNumber,
                rfiDataStatusTypeByRfiDataStatusTypeId,
              } = rfi;
              return (
                <RFI
                  key={rfiNumber}
                  rfiNumber={rfiNumber}
                  formData={jsonData}
                  rowId={rowId}
                  status={rfiDataStatusTypeByRfiDataStatusTypeId.name}
                />
              );
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
