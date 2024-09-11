import { RJSFSchema } from '@rjsf/utils';

const counts: RJSFSchema = {
  title: 'Counts',
  description: '',
  type: 'object',
  required: [
    'communities',
    'indigenousCommunities',
    'nonIndigenousCommunities',

    'totalHouseholdsImpacted',
    'numberOfIndigenousHouseholds',
  ],
  properties: {
    communities: {
      type: 'number',
      title: 'Total number of communities benefitting',
    },
    indigenousCommunities: {
      type: 'number',
      title: 'Number of Indigenous Communities benefitting',
    },
    nonIndigenousCommunities: {
      type: 'number',
      title: 'Number of Non-Indigenous Communities benefitting',
    },
    totalHouseholdsImpacted: {
      type: 'number',
      title: 'Total Households Impacted',
    },
    numberOfIndigenousHouseholds: {
      type: 'number',
      title: 'Number of Indigenous Households',
    },
  },
};

export default counts;
