import styled from 'styled-components';
import { graphql, useFragment } from 'react-relay';
import AnalystRow from './AnalystRow';

const StyledTable = styled('table')`
  margin-bottom: 0px;
  table-layout: fixed;
  width: 100%;
  max-width: 1170px;
`;

const StyledTableHead = styled('thead')`
  padding: 16px 8px;
`;

const StyledTableHeadCell = styled('th')`
  padding: 12px;

  border-top: 1px solid hsla(0, 0%, 0%, 0.12);

  &:first-child {
    padding: 12px;
  }
  &:last-child {
    padding: 12px;
    box-shadow: none;
  }
  font-weight: bold;

  box-shadow: inset -2px 0px white;
`;

interface Props {
  query: any;
}

const AnalystTable: React.FC<Props> = ({ query }) => {
  const queryFragment = useFragment(
    graphql`
      fragment AnalystTable_query on Query {
        ...AnalystRow_query
        allApplications(orderBy: CCBC_NUMBER_ASC) {
          nodes {
            id
            ...AnalystRow_application
          }
        }
      }
    `,
    query
  );

  const { allApplications } = queryFragment;

  return (
    <StyledTable>
      <StyledTableHead>
        <tr>
          <StyledTableHeadCell>CCBC ID</StyledTableHeadCell>
          <StyledTableHeadCell>Status</StyledTableHeadCell>
          <StyledTableHeadCell>Project title</StyledTableHeadCell>
          <StyledTableHeadCell>Organization</StyledTableHeadCell>
          <StyledTableHeadCell>Lead</StyledTableHeadCell>
          <StyledTableHeadCell>Package</StyledTableHeadCell>
        </tr>
      </StyledTableHead>
      <tbody>
        {allApplications?.nodes.map((application) => {
          return (
            <AnalystRow
              application={application}
              query={queryFragment}
              key={application.id}
            />
          );
        })}
      </tbody>
    </StyledTable>
  );
};

export default AnalystTable;
