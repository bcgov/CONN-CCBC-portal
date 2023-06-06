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
        filteredHistory.map((historyItem, index, array) => {
          const { recordId } = historyItem;
          const a = array.slice(index + 1);
          const prevItems = a.filter((item) => {
            // assessment data must match by item type
            if (item.tableName === 'assessment_data') {
              return (
                item.tableName === historyItem.tableName &&
                item.item === historyItem.item
              );
            }
            // rfis must match by rfi_number
            if (item.tableName === 'rfi_data') {
              return (
                item.tableName === historyItem.tableName &&
                item.record.rfi_number === historyItem.record.rfi_number
              );
            }
            return item.tableName === historyItem.tableName;
          });
          const prevHistoryItem = prevItems.length > 0 ? prevItems[0] : {};

          // using index + recordId for key as just recordId was causing strange duplicate record bug for delete history item until page refresh
          return (
            <HistoryRow
              // eslint-disable-next-line react/no-array-index-key
              key={index + recordId}
              historyItem={historyItem}
              prevHistoryItem={prevHistoryItem}
            />
          );
        })}
    </StyledTable>
  );
};

export default HistoryTable;
