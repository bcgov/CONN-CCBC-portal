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
      default: [{}],
      items: {
        type: 'object',
        required: ['geographicName', 'regionalDistrict', 'economicRegion'],
        properties: {
          geographicName: {
            type: 'string',
            title: 'Geographic Name',
          },
          regionalDistrict: {
            type: 'string',
            title: 'Regional District',
          },
          economicRegion: {
            type: 'string',
            title: 'Economic Region',
          },
        },
      },
    },
  },
};

export default locations;
