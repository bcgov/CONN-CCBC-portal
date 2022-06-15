const organizationProfile = {
  organizationProfile: {
    title: 'Organization Profile',
    description: 'Provide an overview of you organization',
    type: 'object',
    required: [
      'projectTitle',
      'typeOfOrganization',
      'other',
      'bandNumber',
      'organizationName',
      'isLegalPrimaryName',
      'isNameLegalName',
      'operatingName',
      'isSubsidiary',
      'parentOrgName',
      'isIndigenousEntity',
      'indigenousEntityDesc',
      'organizationOverview',
      'orgRegistrationDate',
      'bussinessNumber',
    ],
    properties: {
      projectTitle: {
        title:
          'Project title for proposed project. Be descriptive about the geographic region while choosing a project title. We advise not using years in the title.',
        type: 'string',
      },
      typeOfOrganization: {
        title: 'Type of organization',
        type: 'array',
        maxItems: 1,
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
      isLegalPrimaryName: {
        title: 'Is this the primary legal name?',
        type: 'boolean',
        enum: ['Yes', 'No'],
      },
      isNameLegalName: {
        title: 'Is operating name same as legal name?',
        type: 'boolean',
        enum: ['Yes', 'No'],
      },
      isSubsidiary: {
        title:
          'Is this Applicant organization a subsidiary of a parent organization?',
        type: 'boolean',
        enum: ['Yes', 'No'],
      },
      isIndigenousEntity: {
        title: 'Is this applicant organization an Indigenous entity?',
        type: 'boolean',
        enum: ['Yes', 'No'],
      },
      organizationOverview: {
        title:
          'Provide an overview of the organization. Include an overview of its current business model, years in business, experience in operating broadband services, previous federal broadband funding (if applicable), mission/mandate/vision, size of operation (e.g. annual revenue, assets, number of staff), membership (if applicable), current coverage and subscription base (maximum 3,500 characters)',
        type: 'string',
      },
      orgRegistrationDate: {
        title: 'Date of incorporation or registration',
        type: 'string',
      },
      bussinessNumber: {
        title:
          'Applicant business number (9-digit business identifier provided by Canada Revenue Agency)',
        type: 'number',
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
                title: 'In your own words describe your organization type',
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
                enum: ['Yes'],
              },
            },
          },
          {
            properties: {
              isNameLegalName: {
                enum: ['No'],
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
                enum: ['No'],
              },
            },
          },
          {
            properties: {
              isSubsidiary: {
                enum: ['Yes'],
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
                enum: ['No'],
              },
            },
          },
          {
            properties: {
              isIndigenousEntity: {
                enum: ['Yes'],
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
