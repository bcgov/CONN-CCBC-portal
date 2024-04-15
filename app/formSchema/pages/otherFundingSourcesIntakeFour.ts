import { RJSFSchema } from '@rjsf/utils';
import otherFundingSources from './otherFundingSources';

const otherFundingSourcesIntakeFour: Record<string, RJSFSchema> = {
  otherFundingSources: {
    ...otherFundingSources.otherFundingSources,
    properties: {
      ...otherFundingSources.otherFundingSources.properties,
      infrastructureBankFunding2223: {
        title: '2022-23',
        type: 'number',
        minimum: 0,
        maximum: 0,
      },
      infrastructureBankFunding2324: {
        title: '2023-24',
        type: 'number',
        minimum: 0,
        maximum: 0,
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
                      title: 'Name of program',
                      type: 'string',
                    },
                    requestedFundingPartner2223: {
                      title: '2022-23',
                      type: 'number',
                      minimum: 0,
                      maximum: 0,
                    },
                    requestedFundingPartner2324: {
                      title: '2023-24',
                      type: 'number',
                      minimum: 0,
                      maximum: 0,
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
                      readOnly: true,
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

export default otherFundingSourcesIntakeFour;
