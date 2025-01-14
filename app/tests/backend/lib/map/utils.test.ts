/**
 * @jest-environment node
 */
import JSZip from 'jszip';
import {
  parseKMLFromBuffer,
  parseKMZ,
} from '../../../../backend/lib/map/utils';

const kmlData = `
<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Placemark>
    <name>Test Marker</name>
    <description>This is a test marker.</description>
    <Point>
      <coordinates>-123.1207,49.2827,0</coordinates>
    </Point>
  </Placemark>
  <Placemark>
    <name>Test Polygon</name>
    <description>This is a test polygon.</description>
    <Polygon>
      <outerBoundaryIs>
        <LinearRing>
          <coordinates>
            -123.1207,49.2827,0
            -123.1208,49.2828,0
            -123.1209,49.2829,0
            -123.1207,49.2827,0
          </coordinates>
        </LinearRing>
      </outerBoundaryIs>
    </Polygon>
  </Placemark>
  <Placemark>
    <name>Test LineString</name>
    <description>This is a test line string.</description>
    <MultiGeometry>
      <LineString>
          <coordinates>
          -123.1207,49.2827,0
          -123.1208,49.2828,0
          -123.1209,49.2829,0
          </coordinates>
      </LineString>
    </MultiGeometry>
  </Placemark>
</kml>
`;

describe('Map util functions', () => {
  it('should parse KML data from buffer and convert it to GeoJSON', async () => {
    const buffer = Buffer.from(kmlData.trim(), 'utf-8');
    const parsedData = await parseKMLFromBuffer(
      buffer,
      'test-file.kml',
      'Test Source'
    );

    expect(parsedData).toEqual({
      polygons: [
        {
          coordinates: [
            [
              [49.2827, -123.1207],
              [49.2828, -123.1208],
              [49.2829, -123.1209],
              [49.2827, -123.1207],
            ],
          ],
          name: 'Test Polygon',
          description: 'This is a test polygon.',
          style: {},
          fileName: 'test-file.kml',
          source: 'Test Source',
          balloonData: '',
        },
      ],
      markers: [
        {
          coordinates: [49.2827, -123.1207],
          name: 'Test Marker',
          description: 'This is a test marker.',
          style: {},
          fileName: 'test-file.kml',
          source: 'Test Source',
          balloonData: '',
        },
      ],
      lineStrings: [
        {
          coordinates: [
            [
              [49.2827, -123.1207],
              [49.2828, -123.1208],
              [49.2829, -123.1209],
            ],
          ],
          name: 'Test LineString',
          description: 'This is a test line string.',
          style: {},
          fileName: 'test-file.kml',
          source: 'Test Source',
        },
      ],
      bounds: [
        [49.2827, -123.1209],
        [49.2829, -123.1207],
      ],
      center: [49.282775, -123.12077500000001],
      fileName: 'test-file.kml',
      source: 'Test Source',
    });
  });

  it('should parse KMZ data from buffer and convert it to GeoJSON', async () => {
    // Create a KMZ file containing the KML data
    const zip = new JSZip();
    zip.file('doc.kml', kmlData.trim());
    const kmzBuffer = await zip.generateAsync({ type: 'nodebuffer' });

    // Parse the KMZ buffer
    const parsedData = await parseKMZ(
      kmzBuffer,
      'test-file.kmz',
      'Test Source'
    );
    expect(parsedData).toEqual({
      polygons: [
        {
          coordinates: [
            [
              [49.2827, -123.1207],
              [49.2828, -123.1208],
              [49.2829, -123.1209],
              [49.2827, -123.1207],
            ],
          ],
          name: 'Test Polygon',
          description: 'This is a test polygon.',
          style: {},
          fileName: 'test-file.kmz',
          source: 'Test Source',
          balloonData: '',
        },
      ],
      markers: [
        {
          coordinates: [49.2827, -123.1207],
          name: 'Test Marker',
          description: 'This is a test marker.',
          style: {},
          fileName: 'test-file.kmz',
          source: 'Test Source',
          balloonData: '',
        },
      ],
      lineStrings: [
        {
          coordinates: [
            [
              [49.2827, -123.1207],
              [49.2828, -123.1208],
              [49.2829, -123.1209],
            ],
          ],
          name: 'Test LineString',
          description: 'This is a test line string.',
          style: {},
          fileName: 'test-file.kmz',
          source: 'Test Source',
        },
      ],
      bounds: [
        [49.2827, -123.1209],
        [49.2829, -123.1207],
      ],
      center: [49.282775, -123.12077500000001],
      fileName: 'test-file.kmz',
      source: 'Test Source',
    });
  });
});
