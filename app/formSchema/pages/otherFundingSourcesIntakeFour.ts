import { RJSFSchema } from '@rjsf/utils';
import otherFundingSources from './otherFundingSources';

const forcedAnyOtherFundingSources = otherFundingSources as any;

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
      infrastructureBankFunding2425: {
        title: '2024-25',
        type: 'number',
        minimum: 0,
        maximum: 0,
      },
    },
    dependencies: {
      otherFundingSources: {
        oneOf: [
          {
            ...forcedAnyOtherFundingSources.otherFundingSources.dependencies
              .otherFundingSources.oneOf[0],
          },
          {
            properties: {
              ...forcedAnyOtherFundingSources.otherFundingSources.dependencies
                .otherFundingSources.oneOf[1].properties,
              otherFundingSourcesArray: {
                type: 'array',
                default: [{}],
                items: {
                  ...forcedAnyOtherFundingSources.otherFundingSources
                    .dependencies.otherFundingSources.oneOf[1].properties
                    .otherFundingSourcesArray.items,
                  required: [
                    'fundingPartnersName',
                    'fundingSourceContactInfo',
                    'statusOfFunding',
                    'funderType',
                    'totalRequestedFundingPartner',
                    'requestedFundingPartner2526',
                    'requestedFundingPartner2627',
                    'requestedFundingPartner2728',
                    'requestedFundingPartner2829',
                  ],
                  properties: {
                    ...forcedAnyOtherFundingSources.otherFundingSources
                      .dependencies.otherFundingSources.oneOf[1].properties
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
                    requestedFundingPartner2425: {
                      title: '2024-25',
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
