import { RJSFSchema } from '@rjsf/utils';

const locations: RJSFSchema = {
  title: 'Locations',
  description: '',
  type: 'object',
  required: [
    'benefitingCommunities',
    'benefitingIndigenousCommunities',
    'economicRegions',
    'regionalDistricts',
  ],
  properties: {
    benefitingIndigenousCommunities: {
      type: 'string',
      title: 'List of Indigenous communities benefitting',
    },
    benefitingCommunities: {
      type: 'string',
      title: 'List of Non-Indigenous communities benefitting',
    },
    economicRegions: {
      type: 'string',
      title: 'List of Economic Regions',
    },
    regionalDistricts: {
      type: 'string',
      title: 'List of Regional Districts',
    },
  },
};

export default locations;
