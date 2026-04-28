const projectFunding = {
  'ui:order': [
    'fundingRequestedCCBC2223',
    'fundingRequestedCCBC2324',
    'fundingRequestedCCBC2425',
    'fundingRequestedCCBC2526',
    'fundingRequestedCCBC2627',
    'fundingRequestedCCBC2728',
    'fundingRequestedCCBC2829',
    'totalFundingRequestedCCBC',
    'applicationContribution2223',
    'applicationContribution2324',
    'applicationContribution2425',
    'applicationContribution2526',
    'applicationContribution2627',
    'applicationContribution2728',
    'applicationContribution2829',
    'totalApplicantContribution',
  ],
  'ui:title': '',
  fundingRequestedCCBC2223: {
    'ui:widget': 'MoneyWidget',
    'ui:options': {
      hideOptional: true,
    },
  },
  fundingRequestedCCBC2324: {
    'ui:widget': 'MoneyWidget',
    'ui:options': {
      hideOptional: true,
    },
  },
  fundingRequestedCCBC2425: {
    'ui:widget': 'MoneyWidget',
    'ui:options': {
      hideOptional: true,
    },
  },
  fundingRequestedCCBC2526: {
    'ui:widget': 'MoneyWidget',
  },
  fundingRequestedCCBC2627: {
    'ui:widget': 'MoneyWidget',
  },
  fundingRequestedCCBC2728: {
    'ui:widget': 'MoneyWidget',
    'ui:options': {
      hideOptional: true,
    },
  },
  fundingRequestedCCBC2829: {
    'ui:widget': 'MoneyWidget',
    'ui:options': {
      hideOptional: true,
    },
  },
  totalFundingRequestedCCBC: {
    'ui:widget': 'ReadOnlyMoneyWidget',
  },
  applicationContribution2223: {
    'ui:widget': 'MoneyWidget',
    'ui:options': {
      hideOptional: true,
    },
  },
  applicationContribution2324: {
    'ui:widget': 'MoneyWidget',
    'ui:options': {
      hideOptional: true,
    },
  },
  applicationContribution2425: {
    'ui:widget': 'MoneyWidget',
    'ui:options': {
      hideOptional: true,
    },
  },
  applicationContribution2526: {
    'ui:widget': 'MoneyWidget',
  },
  applicationContribution2627: {
    'ui:widget': 'MoneyWidget',
  },
  applicationContribution2728: {
    'ui:widget': 'MoneyWidget',
    'ui:options': {
      hideOptional: true,
    },
  },
  applicationContribution2829: {
    'ui:widget': 'MoneyWidget',
    'ui:options': {
      hideOptional: true,
    },
  },
  totalApplicantContribution: {
    'ui:widget': 'ReadOnlyMoneyWidget',
  },
  'ui:inline': [
    {
      title: 'Amount requested under CCBC per fiscal year (April 1 - March 31)',
      columns: 7,
      fundingRequestedCCBC2223: 1,
      fundingRequestedCCBC2324: 2,
      fundingRequestedCCBC2425: 3,
      fundingRequestedCCBC2526: 4,
      fundingRequestedCCBC2627: 5,
      fundingRequestedCCBC2728: 6,
      fundingRequestedCCBC2829: 7,
    },
    {
      columns: 2,
      totalFundingRequestedCCBC: '1 / 2',
    },
    {
      title:
        'Amount the applicant will contribute per fiscal year (April 1 - March 31)',
      columns: 7,
      applicationContribution2223: 1,
      applicationContribution2324: 2,
      applicationContribution2425: 3,
      applicationContribution2526: 4,
      applicationContribution2627: 5,
      applicationContribution2728: 6,
      applicationContribution2829: 7,
    },
    {
      columns: 2,
      totalApplicantContribution: '1 / 2',
    },
  ],
};

export default projectFunding;
