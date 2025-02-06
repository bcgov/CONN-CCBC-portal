import styled from 'styled-components';
import { graphql, useFragment } from 'react-relay';
import FormDiv from 'components/FormDiv';
import NavigationSidebar from './NavigationSidebar';
import CbcHeader from './CbcHeader';
import ProjectNavigationSidebar from '../ProjectNavigationSidebar';

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  width: 100%;
`;

const StyledFlex = styled.div`
  display: flex;
`;

const StyledFormDiv = styled(FormDiv)`
  max-width: 100%;
`;

const StyledOuterContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin: 0 auto;
  width: 100%;
`;

interface Props {
  children: JSX.Element[] | JSX.Element;
  query: any;
  isFormEditable?: boolean;
}

const CbcAnalystLayout: React.FC<Props> = ({
  children,
  query,
  isFormEditable = false,
}) => {
  const queryFragment = useFragment(
    graphql`
      fragment CbcAnalystLayout_query on Query {
        ...CbcHeader_query
        ...ProjectNavigationSidebar_query
      }
    `,
    query
  );
  return (
    <StyledOuterContainer>
      <StyledContainer>
        <CbcHeader query={queryFragment} isFormEditable={isFormEditable} />
        <StyledFlex>
          <NavigationSidebar />
          <StyledFormDiv>{children}</StyledFormDiv>
        </StyledFlex>
      </StyledContainer>
      <ProjectNavigationSidebar query={queryFragment} />
    </StyledOuterContainer>
  );
};

export default CbcAnalystLayout;
