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
  federalFunding: {
    'ui:widget': 'MoneyWidget',
    'ui:label': 'Federal Funding',
  },
  fundingRequestedCcbc: {
    'ui:widget': 'MoneyWidget',
    'ui:label': 'Total amount requested from CCBC',
  },
  applicantAmount: {
    'ui:widget': 'MoneyWidget',
    'ui:label': 'Applicant Amount',
  },
  cibFunding: {
    'ui:widget': 'MoneyWidget',
    'ui:label': 'CIB Funding',
  },
  fhnaFunding: {
    'ui:widget': 'MoneyWidget',
    'ui:label': 'FHNA Funding',
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
