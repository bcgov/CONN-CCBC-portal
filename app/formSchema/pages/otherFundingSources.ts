const otherFundingSources = {
  otherFundingSources: {
    title: 'Other funding sources',
    type: 'object',
    description:
      'Identify sources of funding that you expect to secure to cover all project costs, not including the Province of British Columbia or the Universal Broadband Fund. Please only include loans that you anticipate receiving from a program or granting agency. Any other loans must be included in the applicant funding.',

    properties: {
      otherFundingSources: {
        title: 'Will you have other funding sources?',
        type: 'boolean',
        enum: ['Yes', 'No'],
      },
    },
    dependencies: {
      otherFundingSources: {
        oneOf: [
          {
            properties: {
              otherFundingSources: {
                enum: ['No'],
              },
            },
          },
          {
            properties: {
              otherFundingSources: {
                enum: ['Yes'],
              },
              otherFundingSourcesArray: {
                type: 'array',
                default: [{}],
                items: {
                  type: 'object',
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
                      type: 'string',
                    },
                    requestedFundingPartner2324: {
                      title: '2023-24',
                      type: 'string',
                    },
                    requestedFundingPartner2425: {
                      title: '2024-25',
                      type: 'string',
                    },
                    requestedFundingPartner2526: {
                      title: '2025-26',
                      type: 'string',
                    },
                    requestedFundingPartner2627: {
                      title: '2026-27',
                      type: 'string',
                    },
                    totalRequestedFundingPartner: {
                      title: 'Total amount requested from funding partner',
                      type: 'string',
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
