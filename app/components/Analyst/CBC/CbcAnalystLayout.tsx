import styled from 'styled-components';
import { graphql, useFragment } from 'react-relay';
import { useFeature } from '@growthbook/growthbook-react';
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

const StyledFormDiv = styled(FormDiv)<{ $improvedNavigation?: boolean }>`
  max-width: ${(props) => (props.$improvedNavigation ? '100%' : '100%')};
  margin-right: ${(props) => (props.$improvedNavigation ? '40px' : 'auto')};
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

  const improvedNavigation =
    useFeature('improved_project_navigation').value ?? false;

  return (
    <StyledOuterContainer>
      <StyledContainer>
        <CbcHeader query={queryFragment} isFormEditable={isFormEditable} />
        <StyledFlex>
          <NavigationSidebar query={queryFragment} />
          <StyledFormDiv $improvedNavigation={improvedNavigation}>
            {children}
          </StyledFormDiv>
        </StyledFlex>
      </StyledContainer>
    </StyledOuterContainer>
  );
};

export default CbcAnalystLayout;
