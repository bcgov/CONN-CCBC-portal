const fundingUiSchema = {
  'ui:field': 'SectionField',
  'ui:options': {
    dividers: true,
  },
  'ui:title': 'Funding',
  bcFundingRequest: {
    'ui:widget': 'MoneyWidget',
    'ui:label': 'BC Funding Request',
  },
  federalFunding: {
    'ui:widget': 'MoneyWidget',
    'ui:label': 'Federal Funding',
  },
  applicantAmount: {
    'ui:widget': 'MoneyWidget',
    'ui:label': 'Applicant Amount',
  },
  otherFunding: {
    'ui:widget': 'MoneyWidget',
    'ui:label': 'Other Funding',
  },
  totalProjectBudget: {
    'ui:widget': 'MoneyWidget',
    'ui:label': 'Total Project Budget',
  },
};

export default fundingUiSchema;
