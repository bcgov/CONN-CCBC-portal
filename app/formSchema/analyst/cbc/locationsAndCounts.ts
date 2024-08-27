import { RJSFSchema } from '@rjsf/utils';

const locationsAndCounts: RJSFSchema = {
  title: 'Locations and counts',
  description: '',
  type: 'object',
  required: [
    'projectLocations',
    'communitiesAndLocalesCount',
    'householdCount',
  ],
  properties: {
    projectLocations: {
      type: 'string',
      title: 'Project Locations',
    },
    geographicNames: {
      type: 'string',
      title: 'Geographic Names',
    },
    regionalDistricts: {
      type: 'string',
      title: 'Regional Districts',
    },
    economicRegions: {
      type: 'string',
      title: 'Economic Regions',
    },
    communitiesAndLocalesCount: {
      type: 'number',
      title: 'Communities and locales count',
    },
    indigenousCommunities: {
      type: 'number',
      title: 'Indigenous Communities',
    },
    householdCount: {
      type: 'number',
      title: 'Household count',
    },
    transportKm: {
      type: 'number',
      title: 'Transport km',
    },
    highwayKm: {
      type: 'number',
      title: 'Highway km',
    },
    restAreas: {
      type: 'number',
      title: 'Rest areas',
    },
  },
};

export default locationsAndCounts;
