import { RJSFSchema } from '@rjsf/utils';

const locations: RJSFSchema = {
  title: 'Locations',
  description: '',
  type: 'object',
  required: [],
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
    communitySourceData: {
      type: 'array',
      default: [],
      items: {
        type: 'integer',
        enum: [],
      },
    },
  },
};

export default locations;
