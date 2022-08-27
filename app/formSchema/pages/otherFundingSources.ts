const otherFundingSources = {
  otherFundingSources: {
    title: 'Other funding sources',
    type: 'object',
    description:
      'Identify sources of funding that you expect to secure to cover all project costs, not including the Province of British Columbia or the Universal Broadband Fund. Please only include loans that you anticipate receiving from a program or granting agency. Any other loans must be included in the applicant funding.',
    required: ['otherFundingSources'],
    properties: {
      infrastructureBankFunding2223: {
        title: '2022-23',
        type: 'number',
      },
      infrastructureBankFunding2324: {
        title: '2023-24',
        type: 'number',
      },
      infrastructureBankFunding2425: {
        title: '2024-25',
        type: 'number',
      },
      infrastructureBankFunding2526: {
        title: '2025-26',
        type: 'number',
      },
      totalInfrastructureBankFunding: {
        title: 'Total amount requested under Canadian Infrastructure Bank',
        type: 'number',
      },
      otherFundingSources: {
        title: 'Will you have other funding sources?',
        type: 'boolean',
        enum: [true, false],
      },
    },
    dependencies: {
      otherFundingSources: {
        oneOf: [
          {
            properties: {
              otherFundingSources: {
                enum: [false],
              },
            },
          },
          {
            properties: {
              otherFundingSources: {
                enum: [true],
              },
              otherFundingSourcesArray: {
                type: 'array',
                default: [{}],
                items: {
                  type: 'object',
                  required: [
                    'fundingPartnersName',
                    'fundingSourceContactInfo',
                    'statusOfFunding',
                    'funderType',
                    'totalRequestedFundingPartner',
                    'requestedFundingPartner2223',
                    'requestedFundingPartner2324',
                    'requestedFundingPartner2425',
                    'requestedFundingPartner2526',
                    'requestedFundingPartner2627',
                  ],
                  properties: {
                    fundingPartnersName: {
                      title: `Funding partner's name`,
                      type: 'string',
                    },
                    fundingSourceContactInfo: {
                      title: `Funding source contact information
                      (Name, Address, Telephone, Email)`,
                      type: 'string',
                    },
                    statusOfFunding: {
                      title: 'Status of funding',
                      type: 'string',
                      enum: [
                        'Submitted',
                        'Received confirmation of eligibility',
                        'Pending',
                        'Approved',
                      ],
                    },
                    funderType: {
                      title: 'Funder type',
                      type: 'string',
                      enum: [
                        'Federal',
                        'Provincial/territorial',
                        'Municipal',
                        'Private',
                      ],
                    },
                    nameOfFundingProgram: {
                      title: 'Name of program (if applicable)',
                      type: 'string',
                    },
                    requestedFundingPartner2223: {
                      title: '2022-23',
                      type: 'number',
                    },
                    requestedFundingPartner2324: {
                      title: '2023-24',
                      type: 'number',
                    },
                    requestedFundingPartner2425: {
                      title: '2024-25',
                      type: 'number',
                    },
                    requestedFundingPartner2526: {
                      title: '2025-26',
                      type: 'number',
                    },
                    requestedFundingPartner2627: {
                      title: '2026-27',
                      type: 'number',
                    },
                    totalRequestedFundingPartner: {
                      title: 'Total amount requested from funding partner',
                      type: 'number',
                    },
                  },
                },
              },
            },
          },
        ],
      },
    },
  },
};

export default otherFundingSources;
