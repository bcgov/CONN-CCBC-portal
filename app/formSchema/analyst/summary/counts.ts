import { RJSFSchema } from '@rjsf/utils';

const counts: RJSFSchema = {
  title: 'Counts',
  description: '',
  type: 'object',
  required: [
    'communities',
    'benefitingCommunities',
    'indigenousCommunities',
    'benefitingIndigenousCommunities',
    'totalHouseholdsImpacted',
    'numberOfIndigenousHouseholds',
  ],
  properties: {
    communities: {
      type: 'number',
      title: 'Communities',
    },
    benefitingCommunities: {
      type: 'number',
      title: 'Benefiting Communities',
    },
    indigenousCommunities: {
      type: 'number',
      title: 'Indigenous Communities',
    },
    benefitingIndigenousCommunities: {
      type: 'number',
      title: 'Benefiting Indigenous Communities',
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
