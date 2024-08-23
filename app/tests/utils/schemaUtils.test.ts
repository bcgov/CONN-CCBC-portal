import {
  generateGeographicNamesByRegionalDistrict,
  generateRegionalDistrictsByEconomicRegion,
  getAllEconomicRegionNames,
} from '../../utils/schemaUtils';

describe('generateGeographicNamesByRegionalDistrict', () => {
  it('should return an empty array if no communities are provided', () => {
    const result = generateGeographicNamesByRegionalDistrict([]);
    expect(result).toEqual({});
  });

  it('should return a dict of geographic names grouped by regional district', () => {
    const communities = [
      {
        bcGeographicName: 'Community 1',
        geographicNameId: 1,
        regionalDistrict: 'Regional District 1',
        economicRegion: 'Economic Region 1',
      },
      {
        bcGeographicName: 'Community 2',
        geographicNameId: 2,
        regionalDistrict: 'Regional District 1',
        economicRegion: 'Economic Region 2',
      },
      {
        bcGeographicName: 'Community 3',
        geographicNameId: 3,
        regionalDistrict: 'Regional District 2',
        economicRegion: 'Economic Region 1',
      },
    ];

    const result = generateGeographicNamesByRegionalDistrict(communities);
    expect(result).toEqual({
      'Regional District 1': new Set([
        { label: 'Community 1', value: 1 },
        { label: 'Community 2', value: 2 },
      ]),
      'Regional District 2': new Set([{ label: 'Community 3', value: 3 }]),
    });
  });
});

describe('generateRegionalDistrictsByEconomicRegion', () => {
  it('should return an empty array if no communities are provided', () => {
    const result = generateRegionalDistrictsByEconomicRegion([]);
    expect(result).toEqual({});
  });

  it('should return a dict of regional districts grouped by economic region', () => {
    const communities = [
      {
        bcGeographicName: 'Community 1',
        geographicNameId: 1,
        regionalDistrict: 'Regional District 1',
        economicRegion: 'Economic Region 1',
      },
      {
        bcGeographicName: 'Community 2',
        geographicNameId: 2,
        regionalDistrict: 'Regional District 4',
        economicRegion: 'Economic Region 2',
      },
      {
        bcGeographicName: 'Community 3',
        geographicNameId: 3,
        regionalDistrict: 'Regional District 2',
        economicRegion: 'Economic Region 1',
      },
    ];

    const result = generateRegionalDistrictsByEconomicRegion(communities);
    expect(result).toEqual({
      'Economic Region 1': new Set([
        'Regional District 1',
        'Regional District 2',
      ]),
      'Economic Region 2': new Set(['Regional District 4']),
    });
  });
});

describe('getAllEconomicRegionNames', () => {
  it('should return an empty array if no communities are provided', () => {
    const result = getAllEconomicRegionNames([]);
    expect(result).toEqual([]);
  });

  it('should return an array of unique economic region names', () => {
    const communities = [
      {
        bcGeographicName: 'Community 1',
        geographicNameId: 1,
        regionalDistrict: 'Regional District 1',
        economicRegion: 'Economic Region 1',
      },
      {
        bcGeographicName: 'Community 2',
        geographicNameId: 2,
        regionalDistrict: 'Regional District 1',
        economicRegion: 'Economic Region 2',
      },
      {
        bcGeographicName: 'Community 3',
        geographicNameId: 3,
        regionalDistrict: 'Regional District 2',
        economicRegion: 'Economic Region 1',
      },
    ];

    const result = getAllEconomicRegionNames(communities);
    expect(result).toEqual(['Economic Region 1', 'Economic Region 2']);
  });
});
