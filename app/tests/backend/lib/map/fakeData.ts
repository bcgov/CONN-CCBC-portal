const fakeMarkerData = {
  coordinates: [49.2827, -123.1207],
  name: 'Test Marker',
  description: 'This is a test marker.',
  // extendedData: {
  //   key1: 'value1',
  //   key2: 'value2',
  // },
  style: {
    color: 'red',
    icon: 'marker-icon.png',
  },
  fileName: 'test-file.kml',
  source: 'Test Source',
  balloonData: '<div><h1>Test Marker</h1><p>This is a test marker.</p></div>',
};

const fakePolygonData = {
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
  // extendedData: {
  //   key1: 'value1',
  //   key2: 'value2',
  // },
  style: {
    color: 'blue',
    fillColor: 'lightblue',
  },
  fileName: 'test-file.kml',
  source: 'Test Source',
  balloonData: '<div><h1>Test Polygon</h1><p>This is a test polygon.</p></div>',
};

const fakeLineStringData = {
  coordinates: [
    [
      [49.2827, -123.1207],
      [49.2828, -123.1208],
      [49.2829, -123.1209],
    ],
  ],
  name: 'Test LineString',
  description: 'This is a test line string.',
  // extendedData: {
  //   key1: 'value1',
  //   key2: 'value2',
  // },
  style: {
    color: 'green',
    weight: 2,
  },
  fileName: 'test-file.kml',
  source: 'Test Source',
};

const fakeParsedKML = {
  polygons: [fakePolygonData],
  markers: [fakeMarkerData],
  lineStrings: [fakeLineStringData],
  bounds: [
    [49.2827, -123.1207],
    [49.2829, -123.1209],
  ],
  center: [49.2828, -123.1208],
  fileName: 'test-file.kml',
  source: 'Test Source',
};

export { fakeMarkerData, fakePolygonData, fakeLineStringData, fakeParsedKML };
