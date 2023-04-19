import { withRelay, RelayProps } from 'relay-nextjs';
import { graphql, usePreloadedQuery } from 'react-relay';
import defaultRelayOptions from 'lib/relay/withRelayOptions';
import { BatchIdQuery } from '__generated__/BatchIdQuery.graphql';
import { ButtonLink, Layout } from 'components';
import { DashboardTabs } from 'components/AnalystDashboard';
import GisTable from 'components/Analyst/GIS/GisTable';
import styled from 'styled-components';

const StyledContainer = styled.div`
  width: 100%;
`;

const TableContainer = styled.div`
  max-width: 100%;
  overflow: scroll;
  overflow-y: hidden;
`;

const RowsAndButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding-top: ${(props) => props.theme.spacing.small};
`;

const getBatchIdPageQuery = graphql`
  query BatchIdQuery($batchId: Int!) {
    gisDataByRowId(rowId: $batchId) {
      jsonData
    }
    session {
      ...DashboardTabs_query
      sub
    }
  }
`;

const BatchIdPage: React.FC<
  RelayProps<Record<string, unknown>, BatchIdQuery>
> = ({ preloadedQuery }) => {
  const { gisDataByRowId, session } = usePreloadedQuery<BatchIdQuery>(
    getBatchIdPageQuery,
    preloadedQuery
  );

  const handleImport = async () => {};

  return (
    <Layout session={session} title="Connecting Communities BC">
      <StyledContainer>
        <DashboardTabs session={session} />
        <TableContainer>
          <GisTable numPreview={3} data={gisDataByRowId.jsonData} />
        </TableContainer>
        <RowsAndButtonContainer
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            paddingTop: '10px',
          }}
        >
          <p>{`${gisDataByRowId.jsonData.length - 3} more rows`}</p>
          <ButtonLink onClick={handleImport} href="#">
            Update GIS Analysis
          </ButtonLink>
        </RowsAndButtonContainer>
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
