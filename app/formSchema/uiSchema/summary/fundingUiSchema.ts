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
  fnhaContribution: {
    'ui:widget': 'MoneyWidget',
    'ui:label': 'FNHA Contribution',
    'ui:options': {
      isSubField: true,
    },
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
  otherFunding: {
    'ui:widget': 'MoneyWidget',
    'ui:label': 'Other Funding',
  },
  cibFunding: {
    'ui:widget': 'MoneyWidget',
    'ui:label': 'CIB Funding',
    'ui:options': {
      isSubField: true,
    },
  },
  fnhaFunding: {
    'ui:widget': 'MoneyWidget',
    'ui:label': 'FNHA Funding',
    'ui:options': {
      isSubField: true,
    },
  },
  totalProjectBudget: {
    'ui:widget': 'MoneyWidget',
    'ui:label': 'Total Project Budget',
  },
};

export default fundingUiSchema;
