import styled from 'styled-components';
import NavigationSidebar from 'components/Analyst/NavigationSidebar';
import FormDiv from 'components/FormDiv';

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  width: 100%;
`;

const StyledFlex = styled.div`
  display: flex;
`;

interface Props {
  children: JSX.Element[] | JSX.Element;
}

const AnalystLayout: React.FC<Props> = ({ children }) => {
  return (
    <StyledContainer>
      {/* This header is a placeholder for the Application Header component */}
      <h1>Application</h1>

      <StyledFlex>
        <NavigationSidebar />
        <FormDiv>{children}</FormDiv>
      </StyledFlex>
    </StyledContainer>
  );
};

export default AnalystLayout;
