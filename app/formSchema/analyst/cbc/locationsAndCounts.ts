import { RJSFSchema } from '@rjsf/utils';

const locationsAndCounts: RJSFSchema = {
  title: 'Locations and counts',
  description: '',
  type: 'object',
  required: [
    'projectLocations',
    'communitiesAndLocalesCount',
    'indigenousCommunities',
    'householdCount',
  ],
  properties: {
    projectLocations: {
      type: 'string',
      title: 'Project Locations',
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
