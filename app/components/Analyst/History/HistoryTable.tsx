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

  const applicationHistory = history?.nodes;

  return (
    <StyledTable cellSpacing="0" cellPadding="0">
      {applicationHistory &&
        applicationHistory.map((historyItem) => {
          const { recordId } = historyItem;
          return <HistoryRow key={recordId} historyItem={historyItem} />;
        })}
    </StyledTable>
  );
};

export default HistoryTable;
