import styled from 'styled-components';
import { graphql, useFragment } from 'react-relay';
import FormDiv from 'components/FormDiv';
import NavigationSidebar from './NavigationSidebar';
import CbcHeader from './CbcHeader';

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

interface Props {
  children: JSX.Element[] | JSX.Element;
  query: any;
  isFormEditMode?: boolean;
}

const CbcAnalystLayout: React.FC<Props> = ({
  children,
  query,
  isFormEditMode = true,
}) => {
  const queryFragment = useFragment(
    graphql`
      fragment CbcAnalystLayout_query on Query {
        ...CbcHeader_query
      }
    `,
    query
  );
  return (
    <StyledContainer>
      <CbcHeader query={queryFragment} isFormEditMode={isFormEditMode} />
      <StyledFlex>
        <NavigationSidebar />
        <StyledFormDiv>{children}</StyledFormDiv>
      </StyledFlex>
    </StyledContainer>
  );
};

export default CbcAnalystLayout;
