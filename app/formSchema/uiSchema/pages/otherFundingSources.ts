const otherFundingSources = {
  'ui:order': [
    'infrastructureBankFunding2223',
    'infrastructureBankFunding2324',
    'infrastructureBankFunding2425',
    'infrastructureBankFunding2526',
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
        'ui:description': 'maximum 250 characters',
        'ui:options': {
          maxLength: 250,
        },
        'ui:widget': 'TextAreaWidget',
      },
      fundingPartnersName: {
        'ui:description': 'maximum 150 characters',
        'ui:options': {
          maxLength: 150,
        },
      },
      statusOfFunding: {
        'ui:widget': 'SelectWidget',
      },
      funderType: {
        'ui:widget': 'SelectWidget',
      },
      nameOfFundingProgram: {
        'ui:description': 'maximum 150 characters',
        'ui:options': {
          maxLength: 150,
          altOptionalText: 'if applicable',
        },
      },
      requestedFundingPartner2223: {
        'ui:widget': 'MoneyWidget',
      },
      requestedFundingPartner2324: {
        'ui:widget': 'MoneyWidget',
      },
      requestedFundingPartner2425: {
        'ui:widget': 'MoneyWidget',
      },
      requestedFundingPartner2526: {
        'ui:widget': 'MoneyWidget',
      },
      requestedFundingPartner2627: {
        'ui:widget': 'MoneyWidget',
      },
      totalRequestedFundingPartner: {
        'ui:widget': 'ReadOnlyMoneyWidget',
      },
      // Custom array button prop that is used in ArrayFieldTemplate
      'ui:array-buttons': {
        addBtnLabel: 'Add another funding source',
        removeBtnLabel: 'Remove',
      },
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
          columns: 5,
          requestedFundingPartner2223: 1,
          requestedFundingPartner2324: 2,
          requestedFundingPartner2425: 3,
          requestedFundingPartner2526: 4,
          requestedFundingPartner2627: 5,
        },
        { columns: 2, totalRequestedFundingPartner: '1 / 2' },
      ],
    },
  },
  'ui:inline': [
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

export default otherFundingSources;
