const organizationLocation = {
  organizationLocation: {
    title: 'Organization location',
    description: 'Provide an address for your organization',
    type: 'object',
    properties: {
      unitNumber: {
        title: 'Unit number',
        type: 'number',
      },
      streetNumber: {
        title: 'Street number',
        type: 'string',
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
