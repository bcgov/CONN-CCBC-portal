import { CbcHistoryTable_query$key } from '__generated__/CbcHistoryTable_query.graphql';
import React, { useMemo, useState } from 'react';
import { useFragment, graphql } from 'react-relay';
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
        }
      }
    `,
    query
  );

  const { history } = cbcByRowId;
  const [filters, setFilters] = useState({ types: [], users: [] });

  const formatUser = (item) => {
    const isSystem =
      item.createdBy === 1 &&
      (!item.ccbcUserByCreatedBy || !item.ccbcUserByCreatedBy?.givenName);
    return isSystem
      ? 'The System'
      : `${item.ccbcUserByCreatedBy?.givenName} ${item.ccbcUserByCreatedBy?.familyName}`;
  };

  const historyItems = useMemo(
    () =>
      history?.nodes?.map((item) => ({
        ...item,
        user: formatUser(item),
      })) ?? [],
    [history?.nodes]
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
              json={
                historyItem.tableName === 'cbc_data'
                  ? {
                      ...historyItem.record?.json_data,
                      project_number: historyItem.record?.project_number,
                      locations: {
                        added: historyItem.record?.added_communities,
                        removed: historyItem.record?.deleted_communities,
                      },
                    }
                  : historyItem.record
              }
              prevJson={
                historyItem.tableName === 'cbc_data'
                  ? {
                      ...historyItem.oldRecord?.json_data,
                      project_number: historyItem.oldRecord?.project_number,
                    }
                  : historyItem.oldRecord
              }
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
