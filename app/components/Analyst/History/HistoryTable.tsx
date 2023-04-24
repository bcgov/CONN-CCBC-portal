import styled from 'styled-components';
import { graphql, useFragment } from 'react-relay';
import HistoryRow from './HistoryRow';

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

const HistoryTable: React.FC<Props> = ({ query }) => {
  const queryFragment = useFragment(
    graphql`
      fragment HistoryTable_query on Query {
        applicationByRowId(rowId: $rowId) {
          history {
            nodes {
              applicationId
              createdAt
              externalAnalyst
              familyName
              item
              givenName
              op
              record
              recordId
              sessionSub
              tableName
            }
          }
        }
      }
    `,
    query
  );

  const {
    applicationByRowId: { history },
  } = queryFragment;

  const applicationHistory = [...history.nodes]?.sort((a, b) => {
    // We may also have to sort by updatedAt in the future
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });

  const receivedIndex = applicationHistory
    .map((historyItem) => historyItem.item)
    .indexOf('received');

  const filteredHistory = applicationHistory.slice(receivedIndex).reverse();

  return (
    <StyledTable cellSpacing="0" cellPadding="0">
      {filteredHistory &&
        filteredHistory.map((historyItem, index) => {
          const { recordId } = historyItem;
          const prevHistoryItem =
            index < filteredHistory.length ? filteredHistory[index + 1] : null;
          return (
            <HistoryRow
              key={recordId}
              historyItem={historyItem}
              prevHistoryItem={prevHistoryItem}
            />
          );
        })}
    </StyledTable>
  );
};

export default HistoryTable;
