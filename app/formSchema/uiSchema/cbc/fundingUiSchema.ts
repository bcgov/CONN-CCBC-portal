const fundingUiSchema = {
  'ui:field': 'SectionField',
  'ui:options': {
    dividers: true,
  },
  bcFundingRequest: {
    'ui:widget': 'MoneyWidget',
  },
  federalFunding: {
    'ui:widget': 'MoneyWidget',
  },
  applicantAmount: {
    'ui:widget': 'MoneyWidget',
  },
  otherFunding: {
    'ui:widget': 'MoneyWidget',
  },
  totalProjectBudget: {
    'ui:widget': 'MoneyWidget',
  },
};

export default fundingUiSchema;
