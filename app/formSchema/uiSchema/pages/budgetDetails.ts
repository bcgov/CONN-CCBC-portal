import { MoneyWidget } from '../../../lib/theme/widgets';

const budgetDetails = {
  uiOrder: ['totalEligibleCosts', 'totalProjectCost'],
  totalEligibleCosts: {
    'ui:widget': MoneyWidget,
    'ui:subtitle': 'Estimated direct employees',
    'ui:options': {
      inputType: 'money',
    },
  },
  totalProjectCost: {
    'ui:widget': MoneyWidget,
  },
};

export default budgetDetails;
