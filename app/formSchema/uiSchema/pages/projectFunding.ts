const projectFunding = {
  'ui:order': [
    'fundingRequestedCCBC2223',
    'fundingRequestedCCBC2324',
    'fundingRequestedCCBC2425',
    'fundingRequestedCCBC2526',
    'fundingRequestedCCBC2627',
    'totalFundingRequestedCCBC',
    'applicationContribution2223',
    'applicationContribution2324',
    'applicationContribution2425',
    'applicationContribution2526',
    'applicationContribution2627',
    'totalApplicantContribution',
  ],
  'ui:title': '',
  fundingRequestedCCBC2223: {
    'ui:widget': 'MoneyWidget',
  },
  fundingRequestedCCBC2324: {
    'ui:widget': 'MoneyWidget',
  },
  fundingRequestedCCBC2425: {
    'ui:widget': 'MoneyWidget',
  },
  fundingRequestedCCBC2526: {
    'ui:widget': 'MoneyWidget',
  },
  fundingRequestedCCBC2627: {
    'ui:widget': 'MoneyWidget',
  },
  totalFundingRequestedCCBC: {
    'ui:widget': 'ReadOnlyMoneyWidget',
  },
  applicationContribution2223: {
    'ui:widget': 'MoneyWidget',
  },
  applicationContribution2324: {
    'ui:widget': 'MoneyWidget',
  },
  applicationContribution2425: {
    'ui:widget': 'MoneyWidget',
  },
  applicationContribution2526: {
    'ui:widget': 'MoneyWidget',
  },
  applicationContribution2627: {
    'ui:widget': 'MoneyWidget',
  },
  totalApplicantContribution: {
    'ui:widget': 'ReadOnlyMoneyWidget',
  },
  'ui:inline': [
    {
      title: 'Amount requested under CCBC per fiscal year (April 1 - March 31)',
      columns: 5,
      fundingRequestedCCBC2223: 1,
      fundingRequestedCCBC2324: 2,
      fundingRequestedCCBC2425: 3,
      fundingRequestedCCBC2526: 4,
      fundingRequestedCCBC2627: 5,
    },
    {
      columns: 2,
      totalFundingRequestedCCBC: '1 / 2',
    },
    {
      title:
        'Amount the applicant will contribute per fiscal year (April 1 - March 31)',
      columns: 5,
      applicationContribution2223: 1,
      applicationContribution2324: 2,
      applicationContribution2425: 3,
      applicationContribution2526: 4,
      applicationContribution2627: 5,
    },
    {
      columns: 2,
      totalApplicantContribution: '1 / 2',
    },
  ],
};

export default projectFunding;
