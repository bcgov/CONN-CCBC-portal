import { useRouter } from 'next/router';
import { graphql, useFragment } from 'react-relay';
import assessmentPillStyles from 'data/assessmentPillStyles';
import { DateTime } from 'luxon';
import styled from 'styled-components';
import StatusPill from '../StatusPill';

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
  const queryFragment = useFragment(
    graphql`
      fragment AssessmentsRow_application on AssessmentData {
        jsonData
      }
    `,
    assessment
  );

  const jsonData = queryFragment?.jsonData;
  const router = useRouter();
  const applicationId = router.query.applicationId as string;
  const date = jsonData?.targetDate;
  const progress = jsonData?.nextStep;
  const decision =
    jsonData?.decision === 'No decision' ? null : jsonData?.decision;
  const isComplete = progress === 'Assessment complete' && decision;
  const assignedTo = jsonData?.assignedTo;

  const dateString =
    date &&
    DateTime.fromISO(date).toLocaleString({
      weekday: 'short',
      month: 'short',
      day: '2-digit',
    });

  const handleClick = () => {
    router.push(
      `/analyst/application/${applicationId}/assessments/${name
        .split(' ')
        .join('-')
        .toLowerCase()}`
    );
  };

  const getStatus = (
    completed: string,
    assigned: string,
    assesmentProgress: string
  ) => {
    if (completed) return 'Complete';
    if (assigned && assesmentProgress === 'Not started') return 'Assigned';
    if (!assesmentProgress) return 'Not started';
    return assesmentProgress;
  };

  return (
    <StyledRow onClick={handleClick}>
      <StyledCell>{name}</StyledCell>
      <StyledCell>
        <StatusPill
          status={getStatus(isComplete, assignedTo, progress)}
          styles={assessmentPillStyles}
        />
      </StyledCell>
      {assignedTo ? (
        <StyledCell>{assignedTo}</StyledCell>
      ) : (
        <StyledDisabledCell>Not assigned</StyledDisabledCell>
      )}
      <StyledCell>{dateString}</StyledCell>
      <StyledCell>
        {decision && (
          <StatusPill
            status={jsonData?.decision}
            styles={assessmentPillStyles}
          />
        )}
      </StyledCell>
    </StyledRow>
  );
};

export default AssessementsRow;
