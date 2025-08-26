import styled from 'styled-components';
import { graphql, useFragment } from 'react-relay';
import NavigationSidebar from 'components/Analyst/NavigationSidebar';
import FormDiv from 'components/FormDiv';
import ApplicationHeader from './ApplicationHeader';
import ProjectNavigationSidebar from './ProjectNavigationSidebar';

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  width: 100%;
`;

const StyledOuterContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin: 0 auto;
  width: 100%;
  position: relative;
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
    /* When ProjectNavigationSidebar is floating, take full width */
    max-width: 100vw;
    margin-left: 10px;
    margin-right: 0;
    padding: 0 4px;
  }
  @media (max-width: 600px) {
    padding: 0 2px;
  }
`;

interface Props {
  children: React.ReactNode;
  query: any;
  mapData?: any;
  isMapExpanded?: boolean;
  setIsMapExpanded?: (isMapExpanded: boolean) => void;
}

const AnalystLayout: React.FC<Props> = ({
  children,
  query,
  mapData = null,
  isMapExpanded = null,
  setIsMapExpanded = null,
}) => {
  const queryFragment = useFragment(
    graphql`
      fragment AnalystLayout_query on Query {
        ...ProjectNavigationSidebar_query
        ...ApplicationHeader_query
      }
    `,
    query
  );
  return (
    <StyledOuterContainer>
      <StyledContainer>
        <ApplicationHeader query={queryFragment} />
        <StyledFlex>
          <NavigationSidebar
            mapData={mapData}
            isMapExpanded={isMapExpanded}
            setIsMapExpanded={setIsMapExpanded}
          />
          <StyledFormDiv>{children}</StyledFormDiv>
        </StyledFlex>
      </StyledContainer>
      <ProjectNavigationSidebar query={queryFragment} />
    </StyledOuterContainer>
  );
};

export default AnalystLayout;
