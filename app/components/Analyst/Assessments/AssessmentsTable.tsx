import styled from 'styled-components';
import { graphql, useFragment } from 'react-relay';
import AssessementsRow from './AssessmentsRow';

const StyledTable = styled('table')`
  width: 100%;
`;

const StyledTableHead = styled('thead')`
  padding: 16px;
`;

const StyledTh = styled('th')`
  padding: 12px;

  border-top: 1px solid hsla(0, 0%, 0%, 0.12);

  font-weight: bold;
`;

interface Props {
  query: any;
}

const AssessmentsTable: React.FC<Props> = ({ query }) => {
  const queryFragment = useFragment(
    graphql`
      fragment AssessmentsTable_query on Application {
        assessmentForm(_slug: "screeningAssessmentSchema") {
          jsonData
        }
      }
    `,
    query
  );
  const { assessmentForm } = queryFragment;
  return (
    <StyledTable>
      <StyledTableHead>
        <tr>
          <StyledTh>Assessment</StyledTh>
          <StyledTh>Progress</StyledTh>
          <StyledTh>Analyst</StyledTh>
          <StyledTh>Target Date</StyledTh>
          <StyledTh>Decision</StyledTh>
        </tr>
      </StyledTableHead>
      <tbody>
        <AssessementsRow
          name="Screening"
          assessment={assessmentForm.jsonData}
        />
      </tbody>
    </StyledTable>
  );
};

export default AssessmentsTable;
