import { Router } from 'express';
import RateLimit from 'express-rate-limit';
import getAuthRole from '../../utils/getAuthRole';
import { performQuery } from './graphql';

const limiter = RateLimit({
  windowMs: 1 * 60 * 1000,
  max: 2000,
});

const cbcCoveragesQuery = `
  query cbcCoveragesQuery($projectNumber: String!) {
    allCbcTransportsGeojsons(condition: { project__: $projectNumber }) {
      nodes {
        geometry
        project__
        gid
      }
    }
    allCbcLastMileCoverageGeojsons(condition: { project__: $projectNumber }) {
      nodes {
        geometry
        gid
        project__
      }
    }
  }
`;

const swapCoords = (coords: number[]): number[] => [coords[1], coords[0]];

const processMultiPolygon = (
  geometry: any,
  gid: number,
  projectNumber: string
) => {
  if (!geometry?.coordinates) return null;
  return geometry.coordinates.map((polygon: number[][][]) => ({
    coordinates: polygon.map((ring: number[][]) =>
      ring.map((coord: number[]) => swapCoords(coord))
    ),
    name: `CBC Project ${projectNumber}`,
    description: `Last Mile Coverage - Feature ${gid}`,
    style: {},
    fileName: '',
    source: 'CBC Last Mile',
  }));
};

const processMultiLineString = (
  geometry: any,
  gid: number,
  projectNumber: string
) => {
  if (!geometry?.coordinates) return null;
  return geometry.coordinates.map((line: number[][]) => ({
    coordinates: [line.map((coord: number[]) => swapCoords(coord))],
    name: `CBC Project ${projectNumber}`,
    description: `Transport - Feature ${gid}`,
    style: {},
    fileName: '',
    source: 'CBC Transport',
  }));
};

const computeBounds = (
  allCoords: number[][]
): [[number, number], [number, number]] => {
  if (allCoords.length === 0) {
    return [
      [47.768, -145.59],
      [60.283, -103.403],
    ];
  }

  let minLat = Infinity;
  let maxLat = -Infinity;
  let minLng = Infinity;
  let maxLng = -Infinity;

  allCoords.forEach(([lat, lng]) => {
    if (lat < minLat) minLat = lat;
    if (lat > maxLat) maxLat = lat;
    if (lng < minLng) minLng = lng;
    if (lng > maxLng) maxLng = lng;
  });

  return [
    [minLat, minLng],
    [maxLat, maxLng],
  ];
};

const collectCoordsFromPolygons = (polygons: any[]): number[][] => {
  const coords: number[][] = [];
  polygons.forEach((p) => {
    p.coordinates.forEach((ring: number[][]) => {
      ring.forEach((coord: number[]) => coords.push(coord));
    });
  });
  return coords;
};

const collectCoordsFromLineStrings = (lineStrings: any[]): number[][] => {
  const coords: number[][] = [];
  lineStrings.forEach((ls) => {
    ls.coordinates.forEach((line: number[][]) => {
      line.forEach((coord: number[]) => coords.push(coord));
    });
  });
  return coords;
};

const cbcMap = Router();

cbcMap.get('/api/cbc-map/:projectNumber', limiter, async (req, res) => {
  const authRole = getAuthRole(req);
  const isRoleAuthorized =
    authRole?.pgRole === 'ccbc_admin' ||
    authRole?.pgRole === 'ccbc_analyst' ||
    authRole?.pgRole === 'cbc_admin' ||
    authRole?.pgRole === 'super_admin';

  if (!isRoleAuthorized) {
    return res.status(404).end();
  }

  const { projectNumber } = req.params;

  try {
    const result = await performQuery(
      cbcCoveragesQuery,
      { projectNumber },
      req
    );

    if (result.errors) {
      return res.status(500).json({ error: result.errors });
    }

    const lastMileNodes =
      result.data?.allCbcLastMileCoverageGeojsons?.nodes || [];
    const transportNodes =
      result.data?.allCbcTransportsGeojsons?.nodes || [];

    const polygons: any[] = [];
    const lineStrings: any[] = [];

    lastMileNodes.forEach((node: any) => {
      const processed = processMultiPolygon(
        node.geometry,
        node.gid,
        projectNumber
      );
      if (processed) polygons.push(...processed);
    });

    transportNodes.forEach((node: any) => {
      const processed = processMultiLineString(
        node.geometry,
        node.gid,
        projectNumber
      );
      if (processed) lineStrings.push(...processed);
    });

    const allCoords = [
      ...collectCoordsFromPolygons(polygons),
      ...collectCoordsFromLineStrings(lineStrings),
    ];
    const bounds = computeBounds(allCoords);

    const response: any = {};

    if (polygons.length > 0) {
      response.finalizedMapUpload = [
        {
          polygons,
          lineStrings: [],
          markers: [],
          bounds,
          source: 'CBC Last Mile',
          fileName: 'CBC Last Mile Coverage',
        },
      ];
    }

    if (lineStrings.length > 0) {
      const transportLayer = {
        polygons: [],
        lineStrings,
        markers: [],
        bounds,
        source: 'CBC Transport',
        fileName: 'CBC Transport',
      };

      if (response.finalizedMapUpload) {
        response.finalizedMapUpload.push(transportLayer);
      } else {
        response.finalizedMapUpload = [transportLayer];
      }
    }

    return res.json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

export default cbcMap;
