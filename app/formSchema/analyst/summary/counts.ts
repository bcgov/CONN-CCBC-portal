import { RJSFSchema } from '@rjsf/utils';

const counts: RJSFSchema = {
  title: 'Counts',
  description: '',
  type: 'object',
  required: [
    'communities',
    'indigenousCommunities',
    'nonIndigenousCommunities',
    'benefitingCommunities',
    'benefitingIndigenousCommunities',
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
    benefitingIndigenousCommunities: {
      type: 'number',
      title: 'List of Indigenous communities benefitting',
    },
    benefitingCommunities: {
      type: 'number',
      title: 'List of Non-Indigenous communities benefitting',
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
