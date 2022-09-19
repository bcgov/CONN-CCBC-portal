const budgetDetails = {
  'ui:order': ['totalEligibleCosts', 'totalProjectCost'],
  'ui:title': '',
  totalEligibleCosts: {
    'ui:widget': 'MoneyWidget',
    'ui:subtitle': 'Estimated direct employees',
    'ui:options': {
      inputType: 'money',
    },
  },
  totalProjectCost: {
    'ui:widget': 'MoneyWidget',
  },
};

export default budgetDetails;
