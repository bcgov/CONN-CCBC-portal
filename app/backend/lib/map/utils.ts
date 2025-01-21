import JSZip from 'jszip'; // For extracting KMZ files
import { DOMParser } from '@xmldom/xmldom';
import { Feature } from 'geojson';
import toGeoJSON from '@tmcw/togeojson'; // Converts KML to GeoJSON

type MarkerData = {
  coordinates: number[];
  name: string;
  description: string;
  extendedData?: Record<string, string>;
  style: any;
  fileName: string;
  source: string;
  balloonData: string;
};

type PolygonData = {
  coordinates: number[][][];
  name: string;
  description: string;
  extendedData?: Record<string, string>;
  style: any;
  fileName: string;
  source: string;
  balloonData: string;
};

type LineStringData = {
  coordinates: number[][][];
  name: string;
  description: string;
  extendedData?: Record<string, string>;
  style: any;
  fileName: string;
  source: string;
};

type ParsedKML = {
  polygons: PolygonData[];
  markers: MarkerData[];
  lineStrings: any[];
  bounds: [[number, number], [number, number]];
  center: [number, number];
  fileName: string;
  source: string;
};

const computeBounds = (
  polygons: PolygonData[],
  markers: MarkerData[],
  lineStrings: LineStringData[]
): [[number, number], [number, number]] => {
  const latitudes: number[] = [];
  const longitudes: number[] = [];

  polygons.forEach((polygon) => {
    polygon.coordinates.forEach((ring) => {
      ring.forEach(([lat, lng]) => {
        latitudes.push(lat);
        longitudes.push(lng);
      });
    });
  });

  markers.forEach((marker) => {
    const [lat, lng] = marker.coordinates;
    latitudes.push(lat);
    longitudes.push(lng);
  });

  lineStrings.forEach((line) => {
    line.coordinates.forEach((ring) => {
      ring.forEach(([lat, lng]) => {
        latitudes.push(lat);
        longitudes.push(lng);
      });
    });
  });

  const minLat = Math.min(...latitudes);
  const maxLat = Math.max(...latitudes);
  const minLng = Math.min(...longitudes);
  const maxLng = Math.max(...longitudes);

  return [
    [minLat, minLng],
    [maxLat, maxLng],
  ];
};

const computeCenter = (
  polygons: PolygonData[],
  markers: MarkerData[],
  lineStrings: LineStringData[]
): [number, number] => {
  const latitudes: number[] = [];
  const longitudes: number[] = [];

  polygons.forEach((polygon) =>
    polygon.coordinates.forEach((ring) =>
      ring.forEach(([lat, lng]) => {
        latitudes.push(lat);
        longitudes.push(lng);
      })
    )
  );

  markers.forEach((marker) => {
    const [lat, lng] = marker.coordinates;
    latitudes.push(lat);
    longitudes.push(lng);
  });

  lineStrings.forEach((line) =>
    line.coordinates.forEach((ring) =>
      ring.forEach(([lat, lng]) => {
        latitudes.push(lat);
        longitudes.push(lng);
      })
    )
  );

  const avgLat = latitudes.reduce((a, b) => a + b, 0) / latitudes.length;
  const avgLng = longitudes.reduce((a, b) => a + b, 0) / longitudes.length;

  return [avgLat, avgLng];
};

const parseKML = (
  kmlContent: string,
  fileName: string,
  source: string
): ParsedKML => {
  const kml = new DOMParser().parseFromString(kmlContent, 'text/xml');
  const geoJson = toGeoJSON.kml(kml as any); // Converts to GeoJSON

  let hasLineStrings = false;

  const polygons: PolygonData[] = [];
  const markers: MarkerData[] = [];
  const lineStrings: LineStringData[] = [];

  // --- Extract BalloonStyle Data  which is present on ISED generated KML---
  const balloonStyles: Record<string, string> = {};
  const styles = kml.getElementsByTagName('Style'); // Use xmldom-compatible method
  for (let i = 0; i < styles.length; i++) {
    const styleElement = styles[i];
    const id = styleElement.getAttribute('id') || '';
    const styleData = { labelStyle: {}, lineStyle: {}, polyStyle: {} };

    const labelStyle = styleElement.getElementsByTagName('LabelStyle')[0];
    if (labelStyle) {
      const color =
        labelStyle.getElementsByTagName('color')[0]?.textContent || '';
      const scale =
        labelStyle.getElementsByTagName('scale')[0]?.textContent || '';
      styleData.labelStyle = { color, scale };
    }

    const lineStyle = styleElement.getElementsByTagName('LineStyle')[0];
    if (lineStyle) {
      const color =
        lineStyle.getElementsByTagName('color')[0]?.textContent || '';
      const width =
        lineStyle.getElementsByTagName('width')[0]?.textContent || '';
      styleData.lineStyle = { color, width };
    }

    const polyStyle = styleElement.getElementsByTagName('PolyStyle')[0];
    if (polyStyle) {
      const color =
        polyStyle.getElementsByTagName('color')[0]?.textContent || '';
      const outline =
        polyStyle.getElementsByTagName('outline')[0]?.textContent || '';
      styleData.polyStyle = { color, outline };
    }

    styles[id] = styleData;

    const balloonTextNode = styleElement.getElementsByTagName('text')[0]; // Use xmldom method
    if (balloonTextNode && balloonTextNode.firstChild) {
      const balloonContent = balloonTextNode.firstChild.nodeValue || ''; // Extract CDATA or text
      balloonStyles[id] = balloonContent;
    }
  }

  geoJson.features.forEach((feature: Feature) => {
    if (
      feature.geometry &&
      'type' in feature.geometry &&
      'coordinates' in feature.geometry
    ) {
      const { type, coordinates } = feature.geometry;

      // Extract properties
      const properties = feature.properties || {};
      const name = properties.name || null;
      const description = properties.description || null;

      // --- Lookup Style and Balloon Content by Style ID ---
      const styleUrl = properties.styleUrl?.replace('#', '') || '';
      const styleData = styles[styleUrl] || {};
      const balloonData = balloonStyles[styleUrl] || '';

      if (type === 'Point') {
        const [lng, lat] = coordinates as [number, number];
        markers.push({
          coordinates: [lat, lng],
          name,
          description,
          style: styleData,
          fileName,
          source,
          balloonData,
        });
      } else if (type === 'Polygon') {
        const polygonCoordinates = (coordinates as [number, number][][]).map(
          (ring) => ring.map(([lng, lat]) => [lat, lng])
        );
        polygons.push({
          coordinates: polygonCoordinates,
          name,
          description,
          style: styleData,
          fileName,
          source,
          balloonData,
        });
      } else if (type === 'LineString') {
        hasLineStrings = true;
      }
    }
  });

  // Handle <Placemark> and nested <MultiGeometry>
  // This is a fallback to properly handle LineStrings which are
  // present on the finalized Map Uploads, due to the way the KML
  // is structured when generated by the Data team
  if (hasLineStrings) {
    const placemarks = kml.getElementsByTagName('Placemark');
    for (let i = 0; i < placemarks.length; i++) {
      const placemark = placemarks[i];

      // get name and description
      const name =
        placemark.getElementsByTagName('name')[0]?.textContent || null;
      const description =
        placemark.getElementsByTagName('description')[0]?.textContent || null;

      // Extract styleUrl and match against styles
      const styleUrl =
        placemark.getElementsByTagName('styleUrl')[0]?.textContent || '';
      const styleId = styleUrl.replace('#', '');
      const styleData = styles[styleId] || {};

      const multiGeometry = placemark.getElementsByTagName('MultiGeometry')[0];
      if (multiGeometry) {
        const lineStringElements =
          multiGeometry.getElementsByTagName('LineString');
        const coordinates = [];
        for (let j = 0; j < lineStringElements.length; j++) {
          const lineString = lineStringElements[j];
          const coordinatesText =
            lineString.getElementsByTagName('coordinates')[0]?.textContent ||
            '';
          const cords = coordinatesText
            .trim()
            .split(/\s+/)
            .map((pair) => {
              const [lng, lat] = pair.split(',').map(Number);
              return [lat, lng];
            });
          coordinates.push(cords);
        }
        lineStrings.push({
          coordinates,
          name,
          description,
          style: styleData,
          fileName,
          source,
        });
      }
    }
  }

  const bounds = computeBounds(polygons, markers, lineStrings);
  const center = computeCenter(polygons, markers, lineStrings);

  return { polygons, markers, lineStrings, bounds, center, fileName, source };
};

// Function to read and parse KMZ files
const parseKMZ = async (buffer, fileName, source) => {
  const MAX_FILES = 100;
  const MAX_SIZE = 25 * 1024 * 1024; // 25MB

  // Check the buffer size
  if (buffer.length > MAX_SIZE) {
    // eslint-disable-next-line no-console
    console.error(
      `KMZ file ${fileName} exceeds the maximum allowed size of 25MB`
    );
  }

  const zip = await JSZip.loadAsync(buffer); // Unzip KMZ buffer

  // Check the number of files in the zip
  if (Object.keys(zip.files).length > MAX_FILES) {
    // eslint-disable-next-line no-console
    console.error(
      `KMZ file ${fileName} contains more than the maximum allowed number of files (10)`
    );
  }

  // Find the KML file inside the KMZ
  const kmlFile = Object.keys(zip.files).find((file) => file.endsWith('.kml'));

  if (!kmlFile) {
    // eslint-disable-next-line no-console
    console.error(`No KML file found in the KMZ ${fileName} archive`);
  }

  // Check for path traversal
  if (kmlFile.includes('..')) {
    // eslint-disable-next-line no-console
    console.error(`Path traversal detected in KMZ file ${fileName}`);
  }
  const kmlContent = await zip.file(kmlFile).async('string');

  return parseKML(kmlContent, fileName, source); // Parse the extracted KML
};

const parseKMLFromBuffer = (buffer, fileName, source): ParsedKML => {
  // Convert buffer to string
  const kmlContent = buffer.toString('utf-8');

  // Reuse the existing parseKML function
  return parseKML(kmlContent, fileName, source);
};

export { parseKMZ, parseKMLFromBuffer };
