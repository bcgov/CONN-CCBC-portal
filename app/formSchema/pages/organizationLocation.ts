import { JSONSchema7 } from 'json-schema';

const organizationLocation: Record<string, JSONSchema7> = {
  organizationLocation: {
    title: 'Organization location',
    description: 'Provide an address for your organization',
    type: 'object',
    required: [
      'streetNumber',
      'streetName',
      'city',
      'province',
      'postalCode',
      'isMailingAddress',
    ],
    properties: {
      unitNumber: {
        title: 'Unit number',
        type: 'string',
      },
      streetNumber: {
        title: 'Street number',
        type: 'number',
      },
      streetName: {
        title: 'Street name',
        type: 'string',
      },
      POBox: {
        title: 'PO box',
        type: 'string',
      },
      city: {
        title: 'City',
        type: 'string',
      },
      province: {
        title: 'Province',
        type: 'string',
        enum: [
          'Alberta',
          'British Columbia',
          'Manitoba',
          'New Brunswick',
          'Newfoundland',
          'Northwest Territories',
          'Nova Scotia',
          'Nunavut',
          'Ontario',
          'Prince Edward Island',
          'Quebec',
          'Saskatchewan',
          'Yukon Territories',
        ],
      },
      postalCode: {
        title: 'Postal code (H0H0H0)',
        type: 'string',
      },
      isMailingAddress: {
        title: 'Is the mailing address the same as above?',
        type: 'boolean',
        enum: [true, false],
        default: true,
      },
    },
    dependencies: {
      isMailingAddress: {
        oneOf: [
          {
            properties: {
              isMailingAddress: {
                enum: [true],
              },
            },
          },
          {
            properties: {
              isMailingAddress: {
                enum: [false],
              },
              mailingAddress: {
                title: 'Mailing address',
                description: 'Provide an address for your organization',
                type: 'object',
                required: [
                  'isMailingAddress',
                  'streetNumberMailing',
                  'streetNameMailing',
                  'cityMailing',
                  'provinceMailing',
                  'postalCodeMailing',
                ],
                properties: {
                  unitNumberMailing: {
                    title: 'Unit number',
                    type: 'string',
                  },
                  streetNumberMailing: {
                    title: 'Street number',
                    type: 'string',
                  },
                  streetNameMailing: {
                    title: 'Street name',
                    type: 'string',
                  },
                  POBoxMailing: {
                    title: 'PO box',
                    type: 'string',
                  },
                  cityMailing: {
                    title: 'City',
                    type: 'string',
                  },
                  provinceMailing: {
                    title: 'Province',
                    type: 'string',
                    enum: [
                      'Alberta',
                      'British Columbia',
                      'Manitoba',
                      'New Brunswick',
                      'Newfoundland',
                      'Northwest Territories',
                      'Nova Scotia',
                      'Nunavut',
                      'Ontario',
                      'Prince Edward Island',
                      'Quebec',
                      'Saskatchewan',
                      'Yukon Territories',
                    ],
                  },
                  postalCodeMailing: {
                    title: 'Postal code (H0H0H0)',
                    type: 'string',
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

export default organizationLocation;
