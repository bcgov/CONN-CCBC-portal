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

const SuccessBanner = () => {
  return (
    <StyledSection>
      <h2>Application complete</h2>
      <p>Application number</p>
      <h3>CCBC-010001</h3>
    </StyledSection>
  );
};

export default SuccessBanner;
