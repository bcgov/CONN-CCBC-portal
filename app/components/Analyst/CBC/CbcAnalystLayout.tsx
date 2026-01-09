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
  width: 100%;
`;

const StyledFormDiv = styled(FormDiv)`
  margin: 0 auto;
  transition:
    max-width 0.2s,
    margin 0.2s,
    padding 0.2s;

  h2 {
    width: 100%;
    display: block;
    clear: both;
  }

  @media (max-width: 1200px) {
    max-width: 700px;
  }
  @media (max-width: 1024px) {
    max-width: calc(100vw - 56px);
    margin-left: 56px;
    margin-right: 0;
    padding: 0 8px;
  }
  @media (max-width: 976px) {
    max-width: 600px;
    margin-left: 10px;
    margin-right: 0;
    padding: 0 4px;
  }
  @media (max-width: 600px) {
    padding: 0 2px;
  }
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
  mapData?: any;
  isMapExpanded?: boolean;
  setIsMapExpanded?: (isMapExpanded: boolean) => void;
}

const CbcAnalystLayout: React.FC<Props> = ({
  children,
  query,
  isFormEditable = false,
  mapData = null,
  isMapExpanded = null,
  setIsMapExpanded = null,
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
          <NavigationSidebar
            mapData={mapData}
            isMapExpanded={isMapExpanded}
            setIsMapExpanded={setIsMapExpanded}
            query={queryFragment}
          />
          <StyledFormDiv>{children}</StyledFormDiv>
        </StyledFlex>
      </StyledContainer>
    </StyledOuterContainer>
  );
};

export default CbcAnalystLayout;
