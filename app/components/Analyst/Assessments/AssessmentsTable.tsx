import styled from 'styled-components';
import { graphql, useFragment } from 'react-relay';
import AssessmentsRow from './AssessmentsRow';

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

const StyledTBody = styled.tbody`
  line-height: 120%;
`;

interface Props {
  query: any;
}

const findAssessment = (list: Array<any>, slug: string) => {
  return list.find((assessment) => assessment.assessmentDataType === slug);
};

const AssessmentsTable: React.FC<Props> = ({ query }) => {
  const queryFragment = useFragment(
    graphql`
      fragment AssessmentsTable_query on Application {
        allAssessments {
          nodes {
            ...AssessmentsRow_application
            assessmentDataType
          }
        }
      }
    `,
    query
  );
  const { allAssessments } = queryFragment;
  const assessments = allAssessments.nodes;

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
      <StyledTBody>
        {/* Not mapping assessment rows so we can easily name row and keep desired order */}
        <AssessmentsRow
          name="Screening"
          assessment={findAssessment(assessments, 'screening')}
        />
        <AssessmentsRow
          name="Technical"
          assessment={findAssessment(assessments, 'technical')}
        />
        <AssessmentsRow
          name="Project Management"
          assessment={findAssessment(assessments, 'projectManagement')}
        />
        <AssessmentsRow
          name="Financial Risk"
          assessment={findAssessment(assessments, 'financialRisk')}
        />
        <AssessmentsRow
          name="Permitting"
          assessment={findAssessment(assessments, 'permitting')}
        />
      </StyledTBody>
    </StyledTable>
  );
};

export default AssessmentsTable;
