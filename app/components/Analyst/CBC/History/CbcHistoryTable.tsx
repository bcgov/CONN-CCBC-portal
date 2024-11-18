import { CbcHistoryTable_query$key } from '__generated__/CbcHistoryTable_query.graphql';
import React from 'react';
import { useFragment, graphql } from 'react-relay';
import styled from 'styled-components';
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
  const queryFragment = useFragment<CbcHistoryTable_query$key>(
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

  const { cbcByRowId } = queryFragment;
  const { history } = cbcByRowId;

  return (
    <StyledTable>
      <tbody>
        {history.nodes.map((historyItem) => (
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
            givenName={historyItem.ccbcUserByCreatedBy.givenName}
            familyName={historyItem.ccbcUserByCreatedBy.familyName}
            op={historyItem.op}
          />
        ))}
      </tbody>
    </StyledTable>
  );
};

export default CbcHistoryTable;
