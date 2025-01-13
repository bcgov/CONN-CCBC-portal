import styled from 'styled-components';
import { graphql, useFragment } from 'react-relay';
import NavigationSidebar from 'components/Analyst/NavigationSidebar';
import FormDiv from 'components/FormDiv';
import ApplicationHeader from './ApplicationHeader';

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
        ...ApplicationHeader_query
      }
    `,
    query
  );
  return (
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
  );
};

export default AnalystLayout;
