const fundingUiSchema = {
  'ui:field': 'SectionField',
  'ui:options': {
    dividers: true,
  },
  'ui:title': 'Funding',
  bcFundingRequested: {
    'ui:widget': 'MoneyWidget',
    'ui:label': 'BC Funding Requested',
  },
  federalFundingRequested: {
    'ui:widget': 'MoneyWidget',
    'ui:label': 'Federal Funding Requested',
  },
  applicantAmount: {
    'ui:widget': 'MoneyWidget',
    'ui:label': 'Applicant Amount',
  },
  otherFundingRequested: {
    'ui:widget': 'MoneyWidget',
    'ui:label': 'Other Funding Requested',
  },
  totalProjectBudget: {
    'ui:widget': 'MoneyWidget',
    'ui:label': 'Total Project Budget',
  },
};

export default fundingUiSchema;
