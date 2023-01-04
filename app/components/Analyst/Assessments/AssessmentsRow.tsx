import { useRouter } from 'next/router';
import { graphql, useFragment } from 'react-relay';
import { DateTime } from 'luxon';
import styled from 'styled-components';
import AssessmentsPill from './AssessmentsPill';

const StyledRow = styled('tr')`
  max-width: 1170px;
  padding: 16px 8px;

  &:hover {
    background: ${(props) => props.theme.color.backgroundGrey};
    cursor: pointer;
  }
`;

const StyledCell = styled.td`
  padding: 16px 12px;
`;

const StyledDisabledCell = styled(StyledCell)`
  color: ${(props) => props.theme.color.disabledGrey};
`;

interface Props {
  assessment: any;
  name: string;
}

const AssessementsRow: React.FC<Props> = ({ assessment, name }) => {
  const { jsonData } = useFragment(
    graphql`
      fragment AssessmentsRow_application on FormData {
        jsonData
      }
    `,
    assessment
  );

  const router = useRouter();
  const applicationId = router.query.applicationId as string;
  const date = jsonData?.targetDate;
  const progress = jsonData?.nextStep;
  const decision = jsonData?.decision;
  const isComplete = progress === 'Assessment complete' && decision;

  const dateString =
    date &&
    DateTime.fromISO(date).toLocaleString({
      weekday: 'short',
      month: 'short',
      day: '2-digit',
    });

  const handleClick = () => {
    router.push(
      `/analyst/application/${applicationId}/assessments/${name.toLowerCase()}`
    );
  };

  return (
    <StyledRow onClick={handleClick}>
      <StyledCell>{name}</StyledCell>
      <StyledCell>
        <AssessmentsPill
          status={isComplete ? 'Complete' : progress || 'Not started'}
        />
      </StyledCell>
      {jsonData?.assignedTo ? (
        <StyledCell>{jsonData?.assignedTo} </StyledCell>
      ) : (
        <StyledDisabledCell>Not assigned</StyledDisabledCell>
      )}
      <StyledCell>{dateString}</StyledCell>
      <StyledCell>
        {decision && <AssessmentsPill status={jsonData?.decision} />}
      </StyledCell>
    </StyledRow>
  );
};

export default AssessementsRow;
