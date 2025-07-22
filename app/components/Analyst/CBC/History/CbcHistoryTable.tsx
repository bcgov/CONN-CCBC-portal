import { CbcHistoryTable_query$key } from '__generated__/CbcHistoryTable_query.graphql';
import { CbcHistoryTableOriginalProjectQuery } from '__generated__/CbcHistoryTableOriginalProjectQuery.graphql';
import React, { useMemo, useState } from 'react';
import { useFragment, useLazyLoadQuery, graphql } from 'react-relay';
import styled from 'styled-components';
import HistoryFilter, {
  filterByType,
  filterByUser,
  getTypeOptions,
  getUserOptions,
} from 'components/Analyst/History/HistoryFilter';
import CbcHistoryRow from './CbcHistoryRow';

const StyledTable = styled.table`
  border: none;
  table-layout: fixed;
  margin-left: 8px;

  & td {
    padding-top: 0;
    padding-bottom: 16px;
  }

  & tr:last-child {
    & td:first-child {
      border: none;
    }
    td {
      padding-bottom: 0px;
    }
  }
`;

interface Props {
  query: any;
}

const CbcHistoryTable: React.FC<Props> = ({ query }) => {
  const { cbcByRowId } = useFragment<CbcHistoryTable_query$key>(
    graphql`
      fragment CbcHistoryTable_query on Query {
        cbcByRowId(rowId: $rowId) {
          history {
            nodes {
              rowId
              record
              oldRecord
              op
              tableName
              createdBy
              createdAt
              ccbcUserByCreatedBy {
                givenName
                familyName
              }
            }
          }
        
        cbcDataByCbcId(first: 500) {
            edges {
              node {
                jsonData
              }
            }
          }
        }
      }
    `,
    query
  );

  const { history, cbcDataByCbcId } = cbcByRowId;
  const [filters, setFilters] = useState({ types: [], users: [] });

  const originalProjectNumber = cbcDataByCbcId?.edges?.[0]?.node?.jsonData?.originalProjectNumber;

  const originalProjectHistory = useLazyLoadQuery<CbcHistoryTableOriginalProjectQuery>(
    graphql`
      query CbcHistoryTableOriginalProjectQuery($originalProjectNumber: Int!) {
        allCbcs(condition: { projectNumber: $originalProjectNumber }) {
          nodes {
            history {
              nodes {
                rowId
                record
                oldRecord
                op
                tableName
                createdBy
                createdAt
                ccbcUserByCreatedBy {
                  givenName
                  familyName
                }
              }
            }
          }
        }
      }
    `,
    { originalProjectNumber: originalProjectNumber || 0 },
    {
      fetchPolicy: originalProjectNumber ? 'store-or-network' : 'store-only',
    }
  );

  const formatUser = (item) => {
    const isSystem =
      item.createdBy === 1 &&
      (!item.ccbcUserByCreatedBy || !item.ccbcUserByCreatedBy?.givenName);
    return isSystem
      ? 'The System'
      : `${item.ccbcUserByCreatedBy?.givenName} ${item.ccbcUserByCreatedBy?.familyName}`;
  };

  const mergedHistory = useMemo(() => {
    let allHistoryNodes = [...(history?.nodes || [])];

    // Add original project history if available
    if (originalProjectHistory?.allCbcs?.nodes?.[0]?.history?.nodes) {
      const originalHistoryNodes = originalProjectHistory.allCbcs.nodes[0].history.nodes;
      allHistoryNodes = [...allHistoryNodes, ...originalHistoryNodes];
    }

    // Sort by createdAt timestamp (most recent first)
    allHistoryNodes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return { nodes: allHistoryNodes };
  }, [history?.nodes, originalProjectHistory]);

  const historyItems = useMemo(
    () =>
      mergedHistory?.nodes?.map((item) => ({
        ...item,
        user: formatUser(item),
      })) ?? [],
    [mergedHistory?.nodes]
  );

  const typeOptions = useMemo(
    () => getTypeOptions(historyItems, filters),
    [historyItems, filters]
  );

  const userOptions = useMemo(
    () => getUserOptions(historyItems, filters),
    [historyItems, filters]
  );

  const filteredHistory = useMemo(
    () =>
      historyItems.filter(
        (historyItem) =>
          filterByType(historyItem, filters) &&
          filterByUser(historyItem, filters)
      ),
    [historyItems, filters]
  );

  return (
    <>
      <HistoryFilter
        filterOptions={{ typeOptions, userOptions }}
        onFilterChange={setFilters}
        filters={filters}
      />
      <StyledTable>
        <tbody>
          {filteredHistory.map((historyItem) => (
            <CbcHistoryRow
              key={historyItem.rowId}
              json={{
                ...historyItem.record?.json_data,
                project_number: historyItem.record?.project_number,
                locations: {
                  added: historyItem.record?.added_communities,
                  removed: historyItem.record?.deleted_communities,
                },
              }}
              prevJson={{
                ...historyItem.oldRecord?.json_data,
                project_number: historyItem.oldRecord?.project_number,
              }}
              changeReason={historyItem.record?.change_reason}
              tableName={historyItem.tableName}
              createdAt={historyItem.createdAt}
              updatedAt={historyItem.record?.updated_at}
              user={historyItem.user}
              op={historyItem.op}
            />
          ))}
        </tbody>
      </StyledTable>
    </>
  );
};

export default CbcHistoryTable;
