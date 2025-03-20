import styled from 'styled-components';
import MapCaller from './Map/MapCaller';

const StyledAside = styled.aside`
  min-height: 100%;
`;

const StyledMap = styled.div`
  position: sticky;
  top: 40px;
`;

const StyledLink = styled.a`
  color: ${(props) => props.theme.color.links};
  text-decoration-line: underline;
  word-break: break-word;
  width: fit-content;
  :hover {
    cursor: pointer;
  }
`;

const SideMap = ({ mapData, isMapExpanded, setIsMapExpanded }) => {
  return (
    <StyledAside>
      <StyledMap>
        {!isMapExpanded && (
          <>
            <MapCaller
              initialData={mapData}
              height="230px"
              width="230px"
              expanded={false}
            />
            <StyledLink
              data-testid="expand-map"
              onClick={(e) => {
                e.preventDefault();
                setIsMapExpanded(true);
              }}
            >
              Expand
            </StyledLink>
          </>
        )}
      </StyledMap>
    </StyledAside>
  );
};

export default SideMap;
