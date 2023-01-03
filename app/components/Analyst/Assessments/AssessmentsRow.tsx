import { useRouter } from 'next/router';
import { DateTime } from 'luxon';
import styled from 'styled-components';

const StyledRow = styled('tr')`
  max-width: 1170px;
  padding: 16px 8px;

  &:hover {
    background: #f2f2f2;
    cursor: pointer;
  }
`;

const StyledCell = styled.td`
  padding: 16px 12px;
`;

interface Props {
  assessment: any;
  name: string;
}

const AssessementsRow: React.FC<Props> = ({ assessment, name }) => {
  const date = assessment?.targetDate;
  const router = useRouter();
  const applicationId = router.query.applicationId as string;

  const dateString = DateTime.fromISO(date).toLocaleString({
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
      <StyledCell>{assessment?.nextStep || 'Not started'}</StyledCell>
      <StyledCell>{assessment?.assignedTo || 'Not assigned'}</StyledCell>
      <StyledCell>{dateString}</StyledCell>
      <StyledCell>{assessment?.decision}</StyledCell>
    </StyledRow>
  );
};

export default AssessementsRow;
