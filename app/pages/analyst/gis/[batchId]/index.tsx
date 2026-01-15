import { withRelay, RelayProps } from 'relay-nextjs';
import { graphql, usePreloadedQuery } from 'react-relay';
import defaultRelayOptions from 'lib/relay/withRelayOptions';
import { BatchIdQuery } from '__generated__/BatchIdQuery.graphql';
import { Layout } from 'components';
import { DashboardTabs } from 'components/AnalystDashboard';
import GisTable from 'components/Analyst/GIS/GisTable';
import styled from 'styled-components';
import { Button } from '@button-inc/bcgov-theme';
import { useRouter } from 'next/router';
import { useParseGisAnalysisMutation } from 'schema/mutations/gis/parseGisAnalysis';
import reportClientError from 'lib/helpers/reportClientError';

const StyledContainer = styled.div`
  width: 100%;
`;

const TableContainer = styled.div`
  max-width: 100%;
  overflow: scroll;
  overflow-y: hidden;
`;

const TextContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding-top: ${(props) => props.theme.spacing.small};
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  gap: ${(props) => props.theme.spacing.small};
`;

const getBatchIdPageQuery = graphql`
  query BatchIdQuery($batchId: Int!) {
    gisDataByRowId(rowId: $batchId) {
      jsonData
    }
    gisDataCounts(batchid: $batchId) {
      nodes {
        total
        countType
        ccbcNumbers
      }
    }
    session {
      ...DashboardTabs_query
      sub
    }
  }
`;

function getNumMoreRows(arrayLength, numPreview) {
  if (numPreview > arrayLength) {
    return 0;
  }
  return arrayLength - numPreview;
}
const numPreview = 3;

const BatchIdPage: React.FC<
  RelayProps<Record<string, unknown>, BatchIdQuery>
> = ({ preloadedQuery }) => {
  const { gisDataByRowId, session } = usePreloadedQuery<BatchIdQuery>(
    getBatchIdPageQuery,
    preloadedQuery
  );
  const router = useRouter();
  const [parseGisAnalysis, isParsingGisAnalysis] =
    useParseGisAnalysisMutation();

  const handleImport = () => {
    parseGisAnalysis({
      variables: {
        input: {
          batchid: Number(router.query.batchId),
        },
      },
      onCompleted() {
        router
          .push(`/analyst/gis/${router.query.batchId}/success`)
          .catch((e) => {
            reportClientError(e, { source: 'gis-batch-redirect' });
          });
      },
    });
  };

  return (
    <Layout session={session} title="Connecting Communities BC">
      <StyledContainer>
        <DashboardTabs session={session} />
        <TableContainer>
          <GisTable numPreview={numPreview} data={gisDataByRowId.jsonData} />
        </TableContainer>
        <TextContainer>
          <p>{`${getNumMoreRows(
            gisDataByRowId.jsonData.length,
            numPreview
          )} more rows`}</p>
        </TextContainer>
        <ButtonContainer>
          <Button onClick={handleImport} disabled={isParsingGisAnalysis}>
            Import
          </Button>
          <Button
            variant="secondary"
            onClick={() => router.push('/analyst/gis')}
          >
            Cancel
          </Button>
        </ButtonContainer>
      </StyledContainer>
    </Layout>
  );
};

export const withRelayOptions = {
  ...defaultRelayOptions,
  variablesFromContext: (ctx) => ({
    batchId: parseInt(ctx.query.batchId.toString(), 10),
  }),
};

export default withRelay(BatchIdPage, getBatchIdPageQuery, withRelayOptions);
