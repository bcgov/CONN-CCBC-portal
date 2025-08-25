import cookie from 'js-cookie';
import styled from 'styled-components';
import MapCaller from './Map/MapCaller';

const StyledAside = styled.aside`
  min-height: 100%;
  @media (max-width: 975px) {
    display: none;
  }
`;

const StyledMap = styled.div`
  position: sticky;
  top: 40px;
`;

interface StyledLinkProps {
  children?: React.ReactNode;
  'data-testid'?: string;
  onClick?: (e: any) => void;
}

const StyledLink = styled.a<StyledLinkProps>`
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
                cookie.set('map_expanded', 'true');
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
