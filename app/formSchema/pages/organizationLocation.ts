const organizationLocation = {
  organizationLocation: {
    title: 'Organization location',
    description: 'Provide an address for your organization',
    type: 'object',
    required: ['streetNumber', 'streetName', 'city', 'province', 'postalCode'],
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
        title: 'Postal code (H0H 0H0)',
        type: 'string',
      },
      isMailingAddress: {
        title: 'Is the mailing address the same as above?',
        type: 'boolean',
        enum: ['Yes', 'No'],
        default: 'Yes',
      },
    },
    dependencies: {
      isMailingAddress: {
        oneOf: [
          {
            properties: {
              isMailingAddress: {
                enum: ['Yes'],
              },
            },
          },
          {
            properties: {
              isMailingAddress: {
                enum: ['No'],
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
                    title: 'Postal code (H0H 0H0)',
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
