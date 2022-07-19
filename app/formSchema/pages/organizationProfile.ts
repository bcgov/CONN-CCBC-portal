const organizationProfile = {
  organizationProfile: {
    title: 'Organization Profile',
    description: 'Provide an overview of you organization.',
    type: 'object',
    required: [
      'typeOfOrganization',
      'bandNumber',
      'organizationName',
      'isNameLegalName',
      'operatingName',
      'isSubsidiary',
      'parentOrgName',
      'isIndigenousEntity',
      'indigenousEntityDesc',
      'organizationOverview',
      'orgRegistrationDate',
      'businessNumber',
    ],
    properties: {
      typeOfOrganization: {
        title: 'Type of organization',
        type: 'array',
        items: {
          type: 'boolean',
          enum: [
            'Incorporated company - private of public',
            'Partnership',
            'Limited partnership',
            'Venture/syndicate',
            'Cooperative',
            'Educational institution - college',
            'Eductational institution - university',
            'Non-profit organization',
            'Municipality',
            'Province',
            'Band Council',
            'Public body owned by local/regional government',
            'Provincial crown corporation',
            'Municipal development corporation',
            'Other',
          ],
        },
        uniqueItems: true,
      },
      organizationName: {
        title: 'Organization name (legal name)',
        type: 'string',
      },
      isNameLegalName: {
        title: 'Is operating name same as legal name?',
        type: 'boolean',
        enum: [true, false],
      },
      isSubsidiary: {
        title:
          'Is this Applicant organization a subsidiary of a parent organization?',
        type: 'boolean',
        enum: [true, false],
      },
      isIndigenousEntity: {
        type: 'boolean',
        enum: [true, false],
      },
      organizationOverview: {
        title:
          'Provide an overview of the organization. Include an overview of its current business model, years in business, experience in operating Broadband Service(s), previous federal broadband funding (if applicable), mission/mandate/vision, size of operation (e.g. annual revenue, assets, number of staff), membership (if applicable), current Coverage and subscription base (maximum 3,500 characters)',
        type: 'string',
      },
      orgRegistrationDate: {
        title: 'Date of incorporation or registration',
        type: 'string',
      },
      businessNumber: {
        title:
          'Applicant business number (9-digit business identifier provided by Canada Revenue Agency)',
        type: 'string',
      },
    },
    dependencies: {
      typeOfOrganization: {
        oneOf: [
          {
            properties: {
              typeOfOrganization: {
                enum: [
                  'Incorporated company - private of public',
                  'Partnership',
                  'Limited partnership',
                  'Venture/syndicate',
                  'Cooperative',
                  'Educational institution - college',
                  'Eductational institution - university',
                  'Non-profit organization',
                  'Municipality',
                  'Province',
                  'Public body owned by local/regional government',
                  'Provincial crown corporation',
                  'Municipal development corporation',
                ],
              },
            },
          },
          {
            properties: {
              typeOfOrganization: {
                enum: ['Band Council'],
              },
              bandNumber: {
                title: 'Please specify the band number',
                type: 'number',
              },
            },
          },
          {
            properties: {
              typeOfOrganization: {
                enum: ['Other'],
              },
              other: {
                title: 'Please specify your organization type',
                type: 'string',
              },
            },
          },
        ],
      },
      isNameLegalName: {
        oneOf: [
          {
            properties: {
              isNameLegalName: {
                enum: [true],
              },
            },
          },
          {
            properties: {
              isNameLegalName: {
                enum: [false],
              },
              operatingName: {
                title: 'Operating name',
                type: 'string',
              },
            },
            required: ['operatingName'],
          },
        ],
      },
      isSubsidiary: {
        oneOf: [
          {
            properties: {
              isSubsidiary: {
                enum: [false],
              },
            },
          },
          {
            properties: {
              isSubsidiary: {
                enum: [true],
              },
              parentOrgName: {
                title: 'Please enter the name of the parent organization',
                type: 'string',
              },
            },
          },
        ],
      },
      isIndigenousEntity: {
        oneOf: [
          {
            properties: {
              isIndigenousEntity: {
                enum: [false],
              },
            },
          },
          {
            properties: {
              isIndigenousEntity: {
                enum: [true],
              },
              indigenousEntityDesc: {
                title:
                  'Please provide a short description of the Indigenous entity (maximum 75 characters)',
                type: 'string',
              },
            },
          },
        ],
      },
    },
  },
};

export default organizationProfile;
