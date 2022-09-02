import { MoneyWidget } from '../../../lib/theme/widgets';

const projectFunding = {
  uiOrder: [
    'totalFundingRequestedCCBC',
    'fundingRequestedCCBC2223',
    'fundingRequestedCCBC2324',
    'fundingRequestedCCBC2425',
    'fundingRequestedCCBC2526',
    'fundingRequestedCCBC2627',
    'applicationContribution2223',
    'applicationContribution2324',
    'applicationContribution2425',
    'applicationContribution2526',
    'applicationContribution2627',
    'totalApplicantContribution',
    'infrastructureBankFunding2223',
    'infrastructureBankFunding2324',
    'infrastructureBankFunding2425',
    'infrastructureBankFunding2526',
    'totalInfrastructureBankFunding',
  ],
  fundingRequestedCCBC2223: {
    'ui:widget': MoneyWidget,
  },
  fundingRequestedCCBC2324: {
    'ui:widget': MoneyWidget,
  },
  fundingRequestedCCBC2425: {
    'ui:widget': MoneyWidget,
  },
  fundingRequestedCCBC2526: {
    'ui:widget': MoneyWidget,
  },
  fundingRequestedCCBC2627: {
    'ui:widget': MoneyWidget,
  },
  totalFundingRequestedCCBC: {
    'ui:widget': MoneyWidget,
  },
  applicationContribution2223: {
    'ui:widget': MoneyWidget,
  },
  applicationContribution2324: {
    'ui:widget': MoneyWidget,
  },
  applicationContribution2425: {
    'ui:widget': MoneyWidget,
  },
  applicationContribution2526: {
    'ui:widget': MoneyWidget,
  },
  applicationContribution2627: {
    'ui:widget': MoneyWidget,
  },
  totalApplicantContribution: {
    'ui:widget': MoneyWidget,
  },
  infrastructureBankFunding2223: {
    'ui:widget': MoneyWidget,
    'ui:options': {
      hideOptional: true,
    },
  },
  infrastructureBankFunding2324: {
    'ui:widget': MoneyWidget,
    'ui:options': {
      hideOptional: true,
    },
  },
  infrastructureBankFunding2425: {
    'ui:widget': MoneyWidget,
    'ui:options': {
      hideOptional: true,
    },
  },
  infrastructureBankFunding2526: {
    'ui:widget': MoneyWidget,
    'ui:options': {
      hideOptional: true,
    },
  },
  totalInfrastructureBankFunding: {
    'ui:widget': MoneyWidget,
    'ui:options': {
      hideOptional: true,
    },
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
    {
      title:
        'Funding from Canadian Infrastructure Bank per fiscal year (April 1 - March 31) (if applicable)',
      columns: 5,
      infrastructureBankFunding2223: 1,
      infrastructureBankFunding2324: 2,
      infrastructureBankFunding2425: 3,
      infrastructureBankFunding2526: 4,
    },
    {
      columns: 2,
      totalInfrastructureBankFunding: '1 / 2',
    },
  ],
};

export default projectFunding;
