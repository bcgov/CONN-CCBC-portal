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
import { FullscreenControl } from 'react-leaflet-fullscreen';
import { useEffect, useRef, useState } from 'react';
import { Resizable } from 're-resizable';
import styled from 'styled-components';
import styles from './Tooltip.module.css';

interface SummaryMapProps {
  height: string;
  width: string;
  expanded?: boolean;
}

const StyledMapContainer = styled(MapContainer)<SummaryMapProps>`
  height: ${(props) => (!props?.expanded ? props.height : '100%')} !important;
  width: ${(props) => (!props?.expanded ? props.width : '100%')} !important;
  .leaflet-container {
    height: ${(props) => (!props?.expanded ? props.height : '100%')} !important;
    width: ${(props) => (!props?.expanded ? props.width : '100%')} !important;
  }
  .leaflet-top,
  .leaflet-bottom,
  .leaflet-control {
    z-index: 400;
  }
  .leaflet-control-layers {
    visibility: ${(props) => (props.expanded ? 'visible' : 'hidden')};
  }
`;

const generateUniqueKey = () => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

const sortAndMarkLatest = (coverages: any[]): any[] => {
  const sorted = [...coverages].filter(Boolean).sort((a, b) => {
    if (a.source?.includes('SOW')) return 1;
    if (b.source?.includes('SOW')) return -1;
    return b.source.localeCompare(a.source, undefined, {
      numeric: true,
    });
  });

  // mark only the latest as checked
  return sorted.map((item, _, arr) => ({
    ...item,
    latest: item.source === arr[0]?.source,
  }));
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
  // Default bounds for BC
  const defaultBounds = [
    [47.768, -145.59], // Southwest corner
    [60.283, -103.403], // Northeast corner
  ];

  const isValidBounds = (bounds) =>
    Array.isArray(bounds) &&
    bounds.length === 2 &&
    Array.isArray(bounds[0]) &&
    Array.isArray(bounds[1]) &&
    bounds[0].every((coord) => coord !== null && typeof coord === 'number') &&
    bounds[1].every((coord) => coord !== null && typeof coord === 'number');

  if (
    data?.finalizedMapUpload?.[0]?.bounds &&
    isValidBounds(data.finalizedMapUpload[0].bounds)
  ) {
    const { bounds } = data.finalizedMapUpload[0];
    return bounds;
  }

  if (
    data?.geographicCoverageMap?.[0]?.bounds &&
    isValidBounds(data.geographicCoverageMap[0].bounds)
  ) {
    const { bounds } = data.geographicCoverageMap[0];
    return bounds;
  }

  // Fallback to default bounds if no valid data is found
  return defaultBounds;
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
  // Add resizable wrapper
  const [size, setSize] = useState({ width, height });
  useEffect(() => {
    const map = mapRef.current;
    if (map) {
      map.invalidateSize(true);
    }
  }, [size]);
  return (
    <Resizable
      size={size}
      minWidth={300}
      minHeight={200}
      enable={expanded ? { bottomRight: true } : false}
      onResizeStop={(e, direction, ref) => {
        setSize({
          width: ref.style.width,
          height: ref.style.height,
        });
      }}
      style={{ position: 'relative' }}
    >
      <div style={{ width: '100%', height: '100%' }}>
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
          {expanded && (
            <FullscreenControl
              position="bottomright"
              forceSeparateButton
              content="⛶"
            />
          )}
          <ScaleControl position="bottomleft" imperial={false} />
          <LayersControl position="topright">
            {data?.finalizedMapUpload?.length > 0 && (
              <>
                {sortAndMarkLatest(data?.finalizedMapUpload)?.map((geoData) => (
                  <LayersControl.Overlay
                    // only enable the latest by default
                    checked={geoData.latest}
                    name={`<span class='${tooltipClass}'>Project Coverage (${geoData?.source})</span>`}
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
                            convertKmlColorToHex(line?.style?.lineStyle?.color)
                              .hex
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
            {data?.geographicCoverageMap?.length > 0 && (
              <>
                {sortAndMarkLatest(data?.geographicCoverageMap)?.map(
                  (geoData) => (
                    <LayersControl.Overlay
                      checked={
                        // enable only when the latest project coverage (no sow or amendment coverage uploads present)
                        geoData.latest && data?.finalizedMapUpload?.length < 1
                      }
                      // Name does not accept anything but string, but it will render basic HTML
                      name={`<span class='${tooltipClass}'>Project Coverage (${geoData?.source})</span>`}
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
                  )
                )}
              </>
            )}
            {data?.currentNetworkInfrastructure?.length > 0 && (
              <>
                {data?.currentNetworkInfrastructure?.map((geoData) => (
                  <LayersControl.Overlay
                    checked={false}
                    name={`<span class='${tooltipClass}'>Current Network Infrastructure (${geoData?.source})</span>`}
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
                    name={`<span class='${tooltipClass}'>Upgraded Network Infrastructure (${geoData?.source})</span>`}
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
          </LayersControl>
        </StyledMapContainer>
      </div>
    </Resizable>
  );
};

export default SummaryMap;
