import { useRouter } from 'next/router';
import { graphql, useFragment } from 'react-relay';
import assessmentPillStyles from 'data/assessmentPillStyles';
import { DateTime } from 'luxon';
import styled from 'styled-components';
import StatusPill from '../../StatusPill';

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

const StyledDecisionCell = styled(StyledCell)`
  & div {
    margin: 8px 0;
  }
  & div:first-child {
    margin-top: 0;
  }
  & div:last-child {
    margin-bottom: 0;
  }
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
  // check if no decision has been made (default option)
  // or in the case of permitting if it's an empty array (same as no decision)
  const decision =
    jsonData?.decision === 'No decision' || jsonData?.decision?.length === 0
      ? null
      : jsonData?.decision;
  const isPermitting = name === 'Permitting';
  const assignedTo = jsonData?.assignedTo;

  const dateString =
    date &&
    DateTime.fromISO(date).toLocaleString({
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    });

  const handleClick = () => {
    router.push(
      `/analyst/application/${applicationId}/assessments/${name
        .split(' ')
        .join('-')
        .toLowerCase()}`
    );
  };

  const getStatus = (assigned: string, assesmentProgress: string) => {
    if (assigned && (assesmentProgress === 'Not started' || !assesmentProgress))
      return 'Assigned';
    if (!assesmentProgress) return 'Not started';
    return assesmentProgress;
  };

  return (
    <StyledRow onClick={handleClick}>
      <StyledCell>{name}</StyledCell>
      <StyledCell>
        <StatusPill
          status={getStatus(assignedTo, progress)}
          styles={assessmentPillStyles}
        />
      </StyledCell>
      {assignedTo ? (
        <StyledCell>{assignedTo}</StyledCell>
      ) : (
        <StyledDisabledCell>Not assigned</StyledDisabledCell>
      )}
      <StyledCell>{dateString}</StyledCell>
      <StyledDecisionCell>
        {decision && !isPermitting && (
          <StatusPill
            status={jsonData?.decision}
            styles={assessmentPillStyles}
          />
        )}
        {decision &&
          isPermitting &&
          decision.map((item) => {
            return (
              <StatusPill
                key={item}
                status={item}
                styles={assessmentPillStyles}
              />
            );
          })}
      </StyledDecisionCell>
    </StyledRow>
  );
};

export default AssessementsRow;
