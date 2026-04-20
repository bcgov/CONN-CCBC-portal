const otherFundingSources = {
  'ui:order': [
    'infrastructureBankFunding2223',
    'infrastructureBankFunding2324',
    'infrastructureBankFunding2425',
    'infrastructureBankFunding2526',
    'infrastructureBankFunding2627',
    'infrastructureBankFunding2728',
    'infrastructureBankFunding2829',
    'totalInfrastructureBankFunding',
    'otherFundingSources',
    'fundingPartnersName',
    'fundingSourceContactInfo',
    'statusOfFunding',
    'funderType',
    'nameOfFundingProgram',
    'requestedFundingPartner2223',
    'requestedFundingPartner2324',
    'requestedFundingPartner2425',
    'requestedFundingPartner2526',
    'requestedFundingPartner2627',
    'requestedFundingPartner2728',
    'requestedFundingPartner2829',
    'totalRequestedFundingPartner',
    'otherFundingSourcesArray',
  ],
  'ui:title': '',
  infrastructureBankFunding2223: {
    'ui:widget': 'MoneyWidget',
    'ui:options': {
      hideOptional: true,
    },
  },
  infrastructureBankFunding2324: {
    'ui:widget': 'MoneyWidget',
    'ui:options': {
      hideOptional: true,
    },
  },
  infrastructureBankFunding2425: {
    'ui:widget': 'MoneyWidget',
    'ui:options': {
      hideOptional: true,
    },
  },
  infrastructureBankFunding2526: {
    'ui:widget': 'MoneyWidget',
    'ui:options': {
      hideOptional: true,
    },
  },
  infrastructureBankFunding2627: {
    'ui:widget': 'MoneyWidget',
    'ui:options': {
      hideOptional: true,
    },
  },
  infrastructureBankFunding2728: {
    'ui:widget': 'MoneyWidget',
    'ui:options': {
      hideOptional: true,
    },
  },
  infrastructureBankFunding2829: {
    'ui:widget': 'MoneyWidget',
    'ui:options': {
      hideOptional: true,
    },
  },
  totalInfrastructureBankFunding: {
    'ui:widget': 'ReadOnlyMoneyWidget',
    'ui:options': {
      hideOptional: true,
    },
  },
  otherFundingSources: {
    'ui:widget': 'RadioWidget',
  },
  otherFundingSourcesArray: {
    items: {
      fundingSourceContactInfo: {
        'ui:options': {
          maxLength: 250,
        },
        'ui:widget': 'TextAreaWidget',
      },
      fundingPartnersName: {
        'ui:options': {
          maxLength: 150,
          showCharacterCount: true,
        },
      },
      statusOfFunding: {
        'ui:widget': 'SelectWidget',
      },
      funderType: {
        'ui:widget': 'SelectWidget',
      },
      nameOfFundingProgram: {
        'ui:options': {
          maxLength: 150,
          altOptionalText: 'if applicable',
          showCharacterCount: true,
        },
      },
      requestedFundingPartner2223: {
        'ui:widget': 'MoneyWidget',
        'ui:options': {
          hideOptional: true,
        },
      },
      requestedFundingPartner2324: {
        'ui:widget': 'MoneyWidget',
        'ui:options': {
          hideOptional: true,
        },
      },
      requestedFundingPartner2425: {
        'ui:widget': 'MoneyWidget',
        'ui:options': {
          hideOptional: true,
        },
      },
      requestedFundingPartner2526: {
        'ui:widget': 'MoneyWidget',
      },
      requestedFundingPartner2627: {
        'ui:widget': 'MoneyWidget',
      },
      requestedFundingPartner2728: {
        'ui:widget': 'MoneyWidget',
        'ui:options': {
          hideOptional: true,
        },
      },
      requestedFundingPartner2829: {
        'ui:widget': 'MoneyWidget',
        'ui:options': {
          hideOptional: true,
        },
      },
      totalRequestedFundingPartner: {
        'ui:widget': 'ReadOnlyMoneyWidget',
      },
      // Custom array button prop that is used in ArrayFieldTemplate
      'ui:array-buttons': {
        addBtnLabel: 'Add another funding source',
        removeBtnLabel: 'Remove',
      },
      'ui:title': ' ',
      'ui:inline': [
        // This is nested so it works in this array object
        {
          columns: 2,
          otherFundingSources: '1 / 2',
        },
        {
          columns: 2,
          fundingPartnersName: '1 / 2',
        },
        {
          columns: 1,
          fundingSourceContactInfo: '1 / 2',
        },
        {
          columns: 1,
          statusOfFunding: '1 / 2',
        },
        {
          columns: 1,
          funderType: '1 / 2',
        },
        {
          columns: 2,
          nameOfFundingProgram: '1 / 2',
        },
        {
          title:
            'Amount requested from funding partner per fiscal year (April 1 - March 31)',
          columns: 7,
          requestedFundingPartner2223: 1,
          requestedFundingPartner2324: 2,
          requestedFundingPartner2425: 3,
          requestedFundingPartner2526: 4,
          requestedFundingPartner2627: 5,
          requestedFundingPartner2728: 6,
          requestedFundingPartner2829: 7,
        },
        { columns: 2, totalRequestedFundingPartner: '1 / 2' },
      ],
    },
  },
  'ui:inline': [
    {
      title:
        'Funding from Canadian Infrastructure Bank per fiscal year (April 1 - March 31) (if applicable)',
      columns: 7,
      infrastructureBankFunding2223: 1,
      infrastructureBankFunding2324: 2,
      infrastructureBankFunding2425: 3,
      infrastructureBankFunding2526: 4,
      infrastructureBankFunding2627: 5,
      infrastructureBankFunding2728: 6,
      infrastructureBankFunding2829: 7,
    },
    {
      columns: 2,
      totalInfrastructureBankFunding: '1 / 2',
    },
  ],
};

export default otherFundingSources;
