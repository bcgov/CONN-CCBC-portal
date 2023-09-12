import styled from 'styled-components';

const StyledProgressContainer = styled.div`
  display: flex;
  align-items: center;

  & span {
    margin-left: 8px;
  }
`;

const StyledProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background-color: #c3d0dc;
`;

interface ProgressBarProps {
  progress: number;
}

const StyledProgress = styled.div<ProgressBarProps>`
  width: ${({ progress }) => progress}%;
  height: 4px;
  background-color: #1a5a96;
`;

const ProgressBar = ({ progress }) => {
  return (
    <StyledProgressContainer>
      <StyledProgressBar>
        <StyledProgress progress={progress} />
      </StyledProgressBar>
      <span>{progress}%</span>
    </StyledProgressContainer>
  );
};

export default ProgressBar;
