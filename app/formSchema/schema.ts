const schema = {
  type: 'object',
  properties: {
    organizationProfile: {
      title: 'Organization Profile',
      description: 'Provide an overview of you organization',
      type: 'object',
      properties: {
        organizationName: {
          title: 'Organization name (legal name)',
          type: 'string',
        },
        isLegalPrimaryName: {
          title: 'Is this the primary legal name?',
          type: 'boolean',
          enum: [true, false],
          enumNames: ['Yes', 'No'],
        },
        isOperatingNameSame: {
          title: 'Is operating name same as legal name?',
          type: 'boolean',
          enum: [true, false],
          enumNames: ['Yes', 'No'],
        },
        operatingNameIfDifferent: {
          title: 'Operating name (if different)',
          type: 'string',
        },
        typeOfOrganization: {
          title: 'Type of organization',
          type: 'array',
          maxItems: 1,
          items: {
            type: 'string',
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
        bandCouncilNumber: {
          title: 'If band council, please specify the band number',
          type: 'number',
        },
        isIndigenousEntity: {
          title: 'Is this applicant organization an Idigenous entity?',
          type: 'boolean',
          enum: [true, false],
          enumName: ['Yes', 'No'],
        },
        indigenousEntityDesc: {
          title: 'Please provide a short description of the Indigenous entity',
          type: 'string',
        },
        organizationOverview: {
          title:
            'Provide an overview of the organization. Include an overview of its current business model, years in business, experience in operating broadband services, previous federal broadband funding (if applicable), mission/mandate/vision, size of operation (e.g. annual revenue, assets, number of staff), membership (if applicable), current coverage and subscription base (maximum 3,500 characters)',
          type: 'string',
        },
        orgRegistrationDate: {
          title: 'Data of incorporation or registration',
          type: 'string',
        },
        bussinessNumber: {
          title:
            'Applicant business number (9-digit business identifier provided by Canada Revenue Agency)',
          type: 'string',
        },
      },
    },
    organizationLocation: {
      title: 'Organization location',
      description: 'Provide an address for your organization',
      type: 'object',
      properties: {
        unitNumber: {
          title: 'Unit number (optional)',
          type: 'string',
        },
      },
    },
  },
};

export default schema;
