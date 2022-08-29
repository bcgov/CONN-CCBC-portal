import styled from 'styled-components';

const StyledSection = styled.section`
  margin: 24px 0;
  padding: 40px;
  color: white;
  text-align: center;
  background-color: ${(props) => props.theme.color.backgroundBlue};
  & h3 {
    margin: 0;
  }
`;

interface Props {
  ccbcNumber?: string;
}

const SuccessBanner: React.FC<Props> = ({ ccbcNumber }) => {
  return (
    <StyledSection>
      <h2>Application submitted</h2>
      <p>Application number</p>
      <h3>{ccbcNumber}</h3>
    </StyledSection>
  );
};

export default SuccessBanner;
