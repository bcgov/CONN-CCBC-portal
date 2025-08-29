import { RJSFSchema } from '@rjsf/utils';

const locations: RJSFSchema = {
  title: 'Locations',
  description: '',
  type: 'object',
  required: [],
  properties: {
    zones: {
      type: 'array',
      minItems: 1,
      items: {
        type: 'number',
        enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
      },
      default: [],
      uniqueItems: true,
      title: 'Project Zone',
    },
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
    communitySourceData: {
      type: 'array',
      default: [],
      items: {
        type: 'integer',
      },
    },
  },
};

export default locations;
