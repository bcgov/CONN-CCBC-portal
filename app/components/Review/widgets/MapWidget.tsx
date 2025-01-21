import { WidgetProps } from '@rjsf/utils';
import MapCaller from 'components/Analyst/Map/MapCaller';
import styled from 'styled-components';

const StyledLink = styled.a`
  color: ${(props) => props.theme.color.links};
  text-decoration-line: underline;
  word-break: break-word;
  width: fit-content;
  :hover {
    cursor: pointer;
  }
`;

const MapWidget: React.FC<WidgetProps> = ({ value }) => {
  return (
    <>
      <MapCaller initialData={value?.json} height="400px" width="900px" />
      <StyledLink
        data-testid="collapse-map"
        onClick={(e) => {
          e.preventDefault();
          value?.setIsMapExpanded(false);
        }}
      >
        Collapse
      </StyledLink>
    </>
  );
};

export default MapWidget;
