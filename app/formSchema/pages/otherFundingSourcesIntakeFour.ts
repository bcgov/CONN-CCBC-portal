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
            ...otherFundingSources.otherFundingSources.dependencies
              .otherFundingSources.oneOf[0],
          },
          {
            properties: {
              ...otherFundingSources.otherFundingSources.dependencies
                .otherFundingSources.oneOf[1].properties,
              otherFundingSourcesArray: {
                type: 'array',
                default: [{}],
                items: {
                  ...otherFundingSources.otherFundingSources.dependencies
                    .otherFundingSources.oneOf[1].properties
                    .otherFundingSourcesArray.items,
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
                    ...otherFundingSources.otherFundingSources.dependencies
                      .otherFundingSources.oneOf[1].properties
                      .otherFundingSourcesArray.items.properties,
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
