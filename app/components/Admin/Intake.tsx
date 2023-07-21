import { graphql, useFragment } from 'react-relay';
import styled from 'styled-components';
import { DateTime } from 'luxon';

interface ContainerProps {
  isCurrentIntake: boolean;
}

const StyledContainer = styled.div<ContainerProps>`
  border-bottom: 1px solid #c4c4c4;
  border-left: ${({ isCurrentIntake }) =>
    isCurrentIntake && '4px solid #3D9B50'};
  padding: 16px;
  margin-bottom: 16px;
`;

const StyledFlex = styled.div`
  display: flex;
  flex-direction: column;

  & div {
    margin-bottom: 16px;
  }

  & h4 {
    margin-bottom: 4px;
  }

  ${({ theme }) => theme.breakpoint.smallUp} {
    flex-direction: row;

    & :not(:last-child) {
      min-width: 200px;
      margin-right: 64px;
    }

    & div {
      margin-bottom: 0;
    }

    & h4 {
      margin-bottom: 16px;
    }
  }
`;

const StyledDescription = styled.h4`
  font-weight: 400;
  color: ${({ theme }) => theme.color.components};
`;

interface IntakeProps {
  intake: any;
  currentIntakeNumber: number;
}

const Intake: React.FC<IntakeProps> = ({ currentIntakeNumber, intake }) => {
  const queryFragment = useFragment(
    graphql`
      fragment Intake_query on Intake {
        ccbcIntakeNumber
        closeTimestamp
        openTimestamp
        rowId
      }
    `,
    intake
  );
  // Need to add description to the fragment which is coming in add intake PR

  const { ccbcIntakeNumber, closeTimestamp, description, openTimestamp } =
    queryFragment;

  const openDate = DateTime.fromISO(openTimestamp).toLocaleString(
    DateTime.DATETIME_FULL
  );

  const closeDate = DateTime.fromISO(closeTimestamp).toLocaleString(
    DateTime.DATETIME_FULL
  );

  return (
    <StyledContainer
      data-testid="intake-container"
      isCurrentIntake={currentIntakeNumber === ccbcIntakeNumber}
    >
      <h3>Intake {ccbcIntakeNumber}</h3>
      <StyledFlex>
        <div>
          <h4>Start date & time</h4>
          <span>{openDate}</span>
        </div>
        <div>
          <h4>End date & time</h4>
          <span>{closeDate}</span>
        </div>
        <div>
          <StyledDescription>Description</StyledDescription>
          <span>{description}</span>
        </div>
      </StyledFlex>
    </StyledContainer>
  );
};

export default Intake;
