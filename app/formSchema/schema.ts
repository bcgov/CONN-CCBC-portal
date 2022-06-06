const useSchema = (devSchema: boolean) => {
  // devSchema is passed in from formbook and enables development pages if set
  const schema = {
    type: 'object',
    properties: {
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
            type: 'string',
            maxItems: 1,
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
            enumNames: [
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
            title: 'Is this applicant organization an Idigenous entity?',
            type: 'boolean',
            enum: ['Yes', 'No'],
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
      ...(devSchema && {
        contactInformation: {
          title: 'Organization contact information',
          type: 'object',
          properties: {
            contactTelephoneNumber: {
              title: 'Telephone number',
              type: 'number',
            },
            contactExtension: {
              title: 'Extension',
              type: 'number',
            },
            contactEmail: {
              title: 'Email',
              type: 'string',
            },
            contactWebsite: {
              title: 'Website',
              type: 'string',
            },
          },
        },
      }),
      ...(devSchema && {
        authorizedContact: {
          title: 'Authorized contact',
          description:
            'Provide the contact information for the authorized contact',
          type: 'object',
          properties: {
            authFamilyName: {
              title: 'Family name of person who will be the authorized contact',
              type: 'string',
            },
            authGivenName: {
              title:
                'Given name of person who will be the authorized contact (optional)',
              type: 'string',
            },
            authPostionTitle: {
              title: 'Position/title',
              type: 'string',
            },
            authEmail: {
              title: 'Email',
              type: 'string',
            },
            authTelephone: {
              title: 'Telephone',
              type: 'number',
            },
            authExtension: {
              title: 'Extension (optional)',
              type: 'number',
            },
            isAuthContactSigningOfficer: {
              title:
                'Is this person an authorized signing officer of the applicant?',
              type: 'boolean',
              enum: [true, false],
              enumNames: ['Yes', 'No'],
            },
          },
        },
      }),
      ...(devSchema && {
        alternateContact: {
          title: 'Alternate contact',
          description:
            'Provide the contact information for the alternate contact',
          type: 'object',
          properties: {
            altFamilyName: {
              title: 'Family name of person who will be the alternate contact',
              type: 'string',
            },
            altGivenName: {
              title: 'Given name of person who will be the alternate contact',
              type: 'string',
            },
            altPostionTitle: {
              title: 'Position/title',
              type: 'string',
            },
            altEmail: {
              title: 'Email',
              type: 'string',
            },
            altTelephone: {
              title: 'Telephone',
              type: 'number',
            },
            altExtension: {
              title: 'Extension (optional)',
              type: 'number',
            },
            isAltContactSigningOfficer: {
              title:
                'Is this person an authorized signing officer of the applicant?',
              type: 'boolean',
              enum: [true, false],
              enumNames: ['Yes', 'No'],
            },
          },
        },
      }),
      ...(devSchema && {
        existingNetworkCoverage: {
          title: 'Existing network coverage',
          type: 'object',
          properties: {
            hasProvidedExitingNetworkCoverage: {
              title:
                'Please indicate if you have already provided your existing network and/or coverage information to ISED or the Canadian Radio-television and Telecommunications Commission (CRTC) in the past 12 months, or if you will submit such information to ISED before the close of applications. For more information on how to submit existing network and coverage information, refer to the Universal Broadband Fund (UBF) website.',
              type: 'array',
              maxItems: 1,
              items: {
                type: 'string',
                enum: [
                  'I have provided existing network information and/or coverage to ISED or the CRTC in the past 12 months',
                  'I will provide existing network information and/or coverage to ISED by the application deadline',
                  'I do not currently have existing coverage',
                ],
              },
              uniqueItems: true,
            },
            hasPassiveInfrastructure: {
              title:
                'Does the applicant own passive infrastructure (including, for example, towers, poles, rights of way or other similar assets and infrastructure)?',
              type: 'boolean',
              enum: [true, false],
              enumNames: ['Yes', 'No'],
            },
            isInfrastuctureAvailable: {
              title:
                'The applicant intends to make reasonable efforts to make its passive infrastructure available for use by other broadband operators to expand and improve coverage in Canada?',
              type: 'boolean',
              enum: [true, false],
              enumNames: ['Yes', 'No'],
            },
            requiresThirdPartyInfrastructureAccess: {
              title:
                'Does the applicant’s project require access to third party passive infrastructure (including for example, towers, poles, rights of way or other similar assets and infrastructure)?',
              type: 'boolean',
              enum: [true, false],
              enumNames: ['Yes', 'No'],
            },
          },
        },
      }),
      ...(devSchema && {
        projectInformation: {
          title: 'Project information',
          description:
            'PLEASE NOTE: If the project is approved, the project information herein may be used, in whole or in part, in publicly accessible websites, media releases, or other similar material.',
          type: 'object',
          properties: {
            projectSpanMultipleLocations: {
              title: 'Does your project span multiple provinces/territories?',
              type: 'boolean',
              enum: [true, false],
              enumNames: ['Yes', 'No'],
            },
            projectLocations: {
              title:
                'If yes, province or territory location (check all that apply)',
              type: 'array',
              items: {
                type: 'string',
                enum: [
                  'Alberta',
                  'British Columbia',
                  'Northwest Territories',
                  'Yukon',
                ],
              },
              uniqueItems: true,
            },
          },
        },
      }),
      ...(devSchema && {
        additionalProjectInformation: {
          title: 'Project information',
          type: 'object',
          properties: {
            projectTitle: {
              title: 'Project title',
              type: 'string',
            },
            geographicAreaDescription: {
              title: 'Geographic project area description',
              type: 'string',
            },
            projectDescription: {
              title:
                'Using non-technical language, provide a description of the project, its key elements, objectives, and benefits',
              type: 'string',
            },
          },
        },
      }),
      ...(devSchema && {
        budgetDetails: {
          title: 'Budget details',
          type: 'object',
          properties: {
            totalEligbleCosts: {
              title: 'Total eligble costs',
              type: 'number',
            },
            totalProjectCost: {
              title: 'Total project cost',
              type: 'number',
            },
            // desgin shows
            requestedCCBCFunding: {
              title:
                'Amount requested under Connecting Communities British Columbia',
              type: 'number',
            },
          },
        },
      }),
    },
  };

  return schema;
};
export default useSchema;
