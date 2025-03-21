'use client';

// Preserve spaces to avoid auto-sorting
import 'leaflet/dist/leaflet.css';

import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css';

import 'leaflet-defaulticon-compatibility';

import parse from 'html-react-parser';

import {
  LayerGroup,
  LayersControl,
  MapContainer,
  Marker,
  Polygon,
  Polyline,
  Popup,
  TileLayer,
  ScaleControl,
} from 'react-leaflet';
import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import styles from './Tooltip.module.css';

interface SummaryMapProps {
  height: string;
  width: string;
  expanded?: boolean;
}

const StyledMapContainer = styled(MapContainer)<SummaryMapProps>`
  height: ${(props) => props.height};
  width: ${(props) => props.width};
  .leaflet-control-layers {
    visibility: ${(props) => (props.expanded ? 'visible' : 'hidden')};
  }
`;

const generateUniqueKey = () => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

const convertKmlColorToHex = (
  kmlColor: string
): {
  hex: string;
  alpha: number;
} => {
  if (kmlColor === null || typeof kmlColor === 'undefined') {
    return { hex: '#000000', alpha: 1 };
  }

  if (!/^([0-9a-fA-F]{8})$/.test(kmlColor)) {
    return { hex: '#000000', alpha: 1 };
  }

  // Extract components from the KML color (AABBGGRR format)
  const alpha = parseInt(kmlColor.slice(0, 2), 16);
  const blue = kmlColor.slice(2, 4);
  const green = kmlColor.slice(4, 6);
  const red = kmlColor.slice(6, 8);

  // Rearrange to #RRGGBB format
  const hex = `#${red}${green}${blue}`;

  return { hex, alpha: alpha / 255 }; // Alpha is normalized to a 0-1 range
};

const getBounds = (data) => {
  if (data?.finalizedMapUpload?.[0]?.bounds?.length === 2) {
    return [
      data?.finalizedMapUpload?.[0]?.bounds[0],
      data?.finalizedMapUpload?.[0]?.bounds[1],
    ];
  }
  if (data?.geographicCoverageMap?.[0]?.bounds?.length === 2) {
    return [
      data?.geographicCoverageMap?.[0]?.bounds[0],
      data?.geographicCoverageMap?.[0]?.bounds[1],
    ];
  }
  return [
    [47.768, -145.59],
    [60.283, -103.403],
  ];
};

const RenderMarkers = ({ markers, name, expanded }) => (
  <>
    {markers?.map((marker) => (
      <Marker
        key={`${name}-${generateUniqueKey()}`}
        position={marker.coordinates}
        interactive={expanded}
        bubblingMouseEvents={expanded}
      >
        <Popup>
          <h4>{marker?.name}</h4>
          <p>
            {typeof marker?.description === 'object'
              ? parse(marker?.description?.value || 'No description')
              : marker?.description}
          </p>
        </Popup>
      </Marker>
    ))}
  </>
);

const SummaryMap = ({ initialData, height, width, expanded = true }) => {
  const data = initialData;
  const tooltipClass = styles['tooltip-map'];
  const tooltipTextClass = styles['tooltip-text-map'];
  const mapRef = useRef(null);
  const [mapReady, setMapReady] = useState(false);
  const pathOptions = {
    interactive: expanded,
    bubblingMouseEvents: expanded,
  }; // Disable interactivity when not expanded
  useEffect(() => {
    const map = mapRef.current;
    if (map) {
      map.fitBounds([getBounds(data)]);
    }
  }, [data, mapReady]);
  return (
    <StyledMapContainer
      preferCanvas
      attributionControl={false}
      ref={mapRef}
      // BC Bounds
      bounds={[
        [47.768, -145.59],
        [60.283, -103.403],
      ]}
      // Zoom is automatically set when using bounds
      // zoom={5}
      scrollWheelZoom
      whenReady={() => {
        setMapReady(true);
      }}
      height={height}
      width={width}
      expanded={expanded}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ScaleControl position="bottomleft" imperial={false} />
      <LayersControl position="topright">
        {data?.geographicCoverageMap?.length > 0 && (
          <>
            {data?.geographicCoverageMap?.map((geoData) => (
              <LayersControl.Overlay
                checked
                // Name does not accept anything but string, but it will render basic HTML
                name={`<span class='${tooltipClass}'>Geographic Coverage (${geoData?.source})<span class='${tooltipTextClass}'>${geoData?.fileName}</span></span>`}
                key={`geo-overlay-${generateUniqueKey()}`}
              >
                <LayerGroup>
                  <RenderMarkers
                    markers={geoData?.markers}
                    name="geo-marker"
                    expanded={expanded}
                  />
                  {geoData?.polygons?.map((polygon) => (
                    <Polygon
                      key={`geo-polygon-${generateUniqueKey()}`}
                      positions={polygon.coordinates}
                      color="blue"
                      pathOptions={pathOptions}
                    >
                      <Popup>
                        {polygon?.balloonData && (
                          <div>{parse(polygon.balloonData)}</div>
                        )}
                      </Popup>
                    </Polygon>
                  ))}
                </LayerGroup>
              </LayersControl.Overlay>
            ))}
          </>
        )}
        {data?.currentNetworkInfrastructure?.length > 0 && (
          <>
            {data?.currentNetworkInfrastructure?.map((geoData) => (
              <LayersControl.Overlay
                checked={false}
                name={`<span class='${tooltipClass}'>Current Network Infrastructure (${geoData?.source})<span class='${tooltipTextClass}'>${geoData?.fileName}</span></span>`}
                key={`current-overlay-${generateUniqueKey()}`}
              >
                <LayerGroup>
                  <RenderMarkers
                    markers={geoData?.markers}
                    name="current-marker"
                    expanded={expanded}
                  />
                  {geoData?.polygons?.map((polygon) => (
                    <Polygon
                      key={`current-polygon-${generateUniqueKey()}`}
                      positions={polygon.coordinates}
                      color="red"
                    >
                      <Popup>
                        <h4>{polygon?.name}</h4>
                        <p>{polygon?.description}</p>
                      </Popup>
                    </Polygon>
                  ))}
                </LayerGroup>
              </LayersControl.Overlay>
            ))}
          </>
        )}
        {data?.upgradedNetworkInfrastructure?.length > 0 && (
          <>
            {data?.upgradedNetworkInfrastructure?.map((geoData) => (
              <LayersControl.Overlay
                checked={false}
                name={`<span class='${tooltipClass}'>Upgraded Network Infrastructure (${geoData?.source})<span class='${tooltipTextClass}'>${geoData?.fileName}</span></span>`}
                key={`upgraded-overlay-${generateUniqueKey()}`}
              >
                <LayerGroup>
                  <RenderMarkers
                    markers={geoData.markers}
                    name="upgraded-marker"
                    expanded={expanded}
                  />
                  {geoData?.polygons?.map((polygon) => (
                    <Polygon
                      key={`upgraded-polygon-${generateUniqueKey()}`}
                      positions={polygon.coordinates}
                      color="green"
                    >
                      <Popup>
                        <h4>{polygon?.name}</h4>
                        <p>{polygon?.description}</p>
                      </Popup>
                    </Polygon>
                  ))}
                </LayerGroup>
              </LayersControl.Overlay>
            ))}
          </>
        )}
        {data?.finalizedMapUpload?.length > 0 && (
          <>
            {data?.finalizedMapUpload?.map((geoData) => (
              <LayersControl.Overlay
                checked
                name={`<span class='${tooltipClass}'>Finalized Map Upload (${geoData?.source})<span class='${tooltipTextClass}'>${geoData?.fileName}</span></span>`}
                key={`finalized-overlay-${generateUniqueKey()}`}
              >
                <LayerGroup>
                  <RenderMarkers
                    markers={geoData.markers}
                    name="finalized-marker"
                    expanded={expanded}
                  />
                  {geoData?.polygons?.map((polygon) => (
                    <Polygon
                      key={`finalized-polygon-${polygon?.fileNam}`}
                      positions={polygon.coordinates}
                      color="purple"
                      pathOptions={pathOptions}
                    >
                      <Popup>
                        <h4>{polygon?.name}</h4>
                        <p>{polygon?.description}</p>
                      </Popup>
                    </Polygon>
                  ))}
                  {geoData?.lineStrings?.map((line) => (
                    <Polyline
                      key={`finalized-line-${line?.fileName}`}
                      positions={line.coordinates}
                      color={
                        convertKmlColorToHex(line?.style?.lineStyle?.color).hex
                      }
                      pathOptions={pathOptions}
                    >
                      <Popup>
                        <h4>{line?.name}</h4>
                        {line?.description && (
                          <div>{parse(line.description)}</div>
                        )}
                      </Popup>
                    </Polyline>
                  ))}
                </LayerGroup>
              </LayersControl.Overlay>
            ))}
          </>
        )}
      </LayersControl>
    </StyledMapContainer>
  );
};

export default SummaryMap;
