import { graphql, useFragment } from 'react-relay';
import styled from 'styled-components';

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
  flex-direction: row;

  & :not(:last-child) {
    margin-right: 64px;
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

  const { ccbcIntakeNumber, closeTimestamp, description, openTimestamp } =
    queryFragment;

  return (
    <StyledContainer isCurrentIntake={currentIntakeNumber === ccbcIntakeNumber}>
      <h3>Intake {ccbcIntakeNumber}</h3>
      <StyledFlex>
        <div>
          <h4>Start date & time</h4>
          <span>{openTimestamp}</span>
        </div>
        <div>
          <h4>End date & time</h4>
          <span>{closeTimestamp}</span>
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
