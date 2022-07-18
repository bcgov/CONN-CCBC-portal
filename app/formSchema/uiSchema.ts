const MAX_TEXTAREA_LENGTH = 3500;
const MAX_LONG_INPUT_LENGTH = 200;
const MAX_MED_INPUT_LENGTH = 75;
const MAX_SHORT_INPUT_LENGTH = 9;
const MIN_INPUT_LENGTH = 1;
const MAX_LENGTH_POSTAL_CODE = 6;

const uiSchema = {
  'ui:order': [
    'projectTitle',
    'geographicAreaDescription',
    'projectDescription',
    'unitNumber',
    'streetNumber',
    'streetName',
    'POBox',
    'city',
    'province',
    'postalCode',
    'isMailingAddress',
    'mailingAddress',
    'unitNumberMailing',
    'streetNumberMailing',
    'streetNameMailing',
    'POBoxMailing',
    'cityMailing',
    'provinceMailing',
    'postalCodeMailing',
    'contactTelephoneNumber',
    'contactExtension',
    'contactEmail',
    'contactWebsite',
    'authFamilyName',
    'authGivenName',
    'authPostionTitle',
    'authEmail',
    'authTelephone',
    'authExtension',
    'isAuthContactSigningOfficer',
    'altFamilyName',
    'altGivenName',
    'altPostionTitle',
    'altEmail',
    'altTelephone',
    'altExtension',
    'isAltContactSigningOfficer',
    'hasProvidedExitingNetworkCoverage',
    'hasPassiveInfrastructure',
    'isInfrastuctureAvailable',
    'requiresThirdPartyInfrastructureAccess',
    'geographicArea',
    'projectSpanMultipleLocations',
    'provincesTerritories',
    'projectLocations',
    'totalEligibleCosts',
    'totalProjectCost',
    'typeOfOrganization',
    'other',
    'bandNumber',
    'organizationName',
    'isLegalPrimaryName',
    'amountFundingRequested',
    'isNameLegalName',
    'operatingName',
    'isSubsidiary',
    'parentOrgName',
    'isIndigenousEntity',
    'indigenousEntityDesc',
    'organizationOverview',
    'orgRegistrationDate',
    'businessNumber',
    'currentEmployment',
    'estimatedDirectEmployees',
    'numberOfEmployeesToWork',
    'hoursOfEmploymentPerWeek',
    'personMonthsToBeCreated',
    'estimatedContractorLabour',
    'numberOfContractorsToWork',
    'hoursOfContractorEmploymentPerWeek',
    'contractorPersonMonthsToBeCreated',
    'declarationsList',
    'declarationsCompletedFor',
    'declarationsDate',
    'declarationsCompletedBy',
    'declarationsTitle',
    'systemDesign',
    'scalability',
    'backboneTechnology',
    'lastMileTechnology',
    'projectBenefits',
    'numberOfHouseholds',
    'projectStartDate',
    'projectCompletionDate',
    'relationshipManagerApplicant',
    'overviewProjectManagementTeam',
    'overviewOfProjectParticipants',
    'operationalPlan',
    'copiesOfRegistration',
    'preparedFinancialStatements',
    'logicalNetworkDiagram',
    'projectSchedule',
    'communityRuralDevelopmentBenefits',
    'evidenceOfConnectivitySpeeds',
    'geographicCoverageMap',
    'coverageAssessmentStatistics',
    'currentNetworkInfastructure',
    'upgradedNetworkInfrastructure',
    'eligibilityAndImpactsCalculator',
    'detailedBudget',
    'financialForecast',
    'lastMileIspOffering',
    'popWholesalePricing',
    'communityRuralDevelopmentBenefitsTemplate',
    'wirelessAddendum',
    'supportingConnectivityEvidence',
    'geographicNames',
    'equipmentDetails',
    'totalFundingRequestedCCBC',
    'fundingRequestedCCBC2223',
    'fundingRequestedCCBC2324',
    'fundingRequestedCCBC2425',
    'fundingRequestedCCBC2526',
    'fundingRequestedCCBC2627',
    'applicationContribution2223',
    'applicationContribution2324',
    'applicationContribution2425',
    'applicationContribution2526',
    'applicationContribution2627',
    'totalApplicantContribution',
    'infrastructureBankFunding2223',
    'infrastructureBankFunding2324',
    'infrastructureBankFunding2425',
    'infrastructureBankFunding2526',
    'totalInfrastructureBankFunding',
    'otherFundingSources',
    'fundingPartnersName',
    'fundingSourceContactInfo',
    'statusOfFunding',
    'funderType',
    'nameOfFundingProgram',
    'requestedFundingPartner2223',
    'requestedFundingPartner2324',
    'requestedFundingPartner2425',
    'requestedFundingPartner2526',
    'requestedFundingPartner2627',
    'totalRequestedFundingPartner',
    'otherFundingSourcesArray',
    'acknowledgeReviewEmptyFields',
  ],
  projectTitle: {
    'ui:description': 'maximum 200 characters',
    'ui:title':
      'Project title. Be descriptive about the geographic region. We advise not using years in the title.',
    'ui:options': {
      maxLength: MAX_LONG_INPUT_LENGTH,
    },
  },
  geographicAreaDescription: {
    'ui:description': 'maximum 150 characters',
    'ui:title':
      'Describe the geographic location of the project area (i.e., include the closest communities and the general area which the project will target).',

    'ui:options': {
      maxLength: 150,
    },
  },
  projectDescription: {
    'ui:widget': 'TextAreaWidget',
    'ui:description': 'maximum 3,500 characters',
    'ui:title':
      'Using non-technical language, provide a description of the project, including its key elements, purpose, objectives and benefits. Identify the ‘who’, ‘what’, ‘where’, ‘when’ and ‘why’. Please avoid including confidential or proprietary information.',

    'ui:options': {
      maxLength: MAX_TEXTAREA_LENGTH,
    },
  },
  geographicArea: {
    'ui:widget': 'CheckboxesWidget',
    'ui:options': {
      // Todo: set another constant or change to 200
      maxLength: 150,
    },
  },
  projectSpanMultipleLocations: {
    'ui:widget': 'RadioWidget',
  },
  provincesTerritories: {
    'ui:widget': 'CheckboxesWidget',
  },
  hasProvidedExitingNetworkCoverage: {
    'ui:widget': 'RadioWidget',
  },
  hasPassiveInfrastructure: {
    'ui:widget': 'RadioWidget',
  },
  isInfrastuctureAvailable: {
    'ui:widget': 'RadioWidget',
  },
  requiresThirdPartyInfrastructureAccess: {
    'ui:widget': 'RadioWidget',
  },
  amountFundingRequested: {},
  organizationName: {
    'ui:options': {
      maxLength: MAX_LONG_INPUT_LENGTH,
    },
  },
  isLegalPrimaryName: {
    'ui:widget': 'RadioWidget',
  },
  isNameLegalName: {
    'ui:widget': 'RadioWidget',
  },
  isSubsidiary: {
    'ui:widget': 'RadioWidget',
  },
  operatingNameIfDifferent: {},
  typeOfOrganization: {
    'ui:widget': 'RadioWidget',
  },
  bandCouncilNumber: {},
  isIndigenousEntity: {
    'ui:widget': 'RadioWidget',
    'ui:options': {
      label: false,
    },
  },
  indigenousEntityDesc: {
    'ui:options': {
      maxLength: MAX_MED_INPUT_LENGTH,
    },
  },
  organizationOverview: {
    'ui:widget': 'TextAreaWidget',
    'ui:options': {
      maxLength: MAX_TEXTAREA_LENGTH,
    },
  },
  orgRegistrationDate: {
    'ui:widget': 'DatePickerWidget',
  },
  bussinessNumber: {
    'ui:options': {
      maxLength: MAX_SHORT_INPUT_LENGTH,
      inputType: 'wholeNumber',
    },
  },
  isMailingAddress: {
    'ui:widget': 'RadioWidget',
  },
  unitNumber: {
    'ui:options': {
      maxLength: MAX_SHORT_INPUT_LENGTH,
    },
  },
  streetNumber: {
    'ui:options': {
      maxLength: MAX_SHORT_INPUT_LENGTH,
      minLength: MIN_INPUT_LENGTH,
    },
  },
  province: {
    'ui:widget': 'SelectWidget',
  },
  postalCode: {
    'ui:options': {
      maxLength: MAX_LENGTH_POSTAL_CODE,
    },
  },
  POBox: {
    'ui:options': {
      maxLength: MAX_SHORT_INPUT_LENGTH,
    },
  },
  isAuthContactSigningOfficer: {
    'ui:widget': 'RadioWidget',
  },
  authTelephone: {
    'ui:options': {
      inputType: 'phone',
    },
  },
  altTelephone: {
    'ui:options': {
      inputType: 'phone',
    },
  },
  contactTelephoneNumber: {
    'ui:options': {
      inputType: 'phone',
    },
  },
  isFirstContact: {
    'ui:widget': 'CheckboxWidget',
    'ui:title': ' ',
  },
  isAltContactSigningOfficer: {
    'ui:widget': 'RadioWidget',
  },
  isAltFirstContact: {
    'ui:widget': 'CheckboxWidget',
    'ui:options': {
      label: false,
    },
  },
  currentEmployment: {
    'ui:options': {
      maxLength: 7,
      inputType: 'commaMask',
      decimals: 0,
    },
  },
  estimatedDirectEmployees: {
    'ui:subtitle': 'Estimated direct employees',
  },
  numberOfEmployeesToWork: {
    'ui:options': {
      inputType: 'commaMask',
      decimals: 0,
    },
  },
  hoursOfEmploymentPerWeek: {
    'ui:options': {
      inputType: 'commaMask',
      decimals: 1,
    },
  },
  personMonthsToBeCreated: {
    'ui:options': {
      inputType: 'commaMask',
      decimals: 1,
    },
  },
  estimatedContractorLabour: {
    'ui:subtitle': 'Estimated contracted labour',
  },
  numberOfContractorsToWork: {
    'ui:options': {
      inputType: 'commaMask',
      decimals: 0,
    },
  },
  hoursOfContractorEmploymentPerWeek: {
    'ui:options': {
      inputType: 'commaMask',
      decimals: 1,
    },
  },
  contractorPersonMonthsToBeCreated: {
    'ui:options': {
      inputType: 'commaMask',
      decimals: 1,
    },
  },
  declarationsList: {
    'ui:title': ` `,
    'ui:widget': 'CheckboxesWidget',
  },
  declarationsDate: {
    'ui:widget': 'DatePickerWidget',
  },
  backboneTechnology: {
    'ui:widget': 'CheckboxesWidget',
    'ui:options': {
      maxLength: MAX_TEXTAREA_LENGTH,
    },
  },
  lastMileTechnology: {
    'ui:widget': 'CheckboxesWidget',
    'ui:options': {
      maxLength: MAX_TEXTAREA_LENGTH,
    },
  },
  systemDesign: {
    'ui:widget': 'TextAreaWidget',
    'ui:description': 'maximum 3,500 characters',
    'ui:options': {
      maxLength: MAX_TEXTAREA_LENGTH,
    },
  },
  scalability: {
    'ui:widget': 'TextAreaWidget',
    'ui:description': 'maximum 3,500 characters',
    'ui:options': {
      maxLength: MAX_TEXTAREA_LENGTH,
    },
  },
  projectBenefits: {
    'ui:widget': 'TextAreaWidget',
    'ui:description': 'maximum 3,500 characters',
    'ui:options': {
      maxLength: MAX_TEXTAREA_LENGTH,
      label: false,
    },
  },
  numberOfHouseholds: {
    'ui:options': {
      inputType: 'wholeNumber',
    },
  },
  projectStartDate: {
    'ui:widget': 'DatePickerWidget',
  },
  projectCompletionDate: {
    'ui:widget': 'DatePickerWidget',
  },
  relationshipManagerApplicant: {
    'ui:widget': 'TextAreaWidget',
    'ui:description': 'maximum 3,500 characters',
    'ui:options': {
      maxLength: MAX_TEXTAREA_LENGTH,
    },
  },
  overviewProjectManagementTeam: {
    'ui:widget': 'TextAreaWidget',
    'ui:description': 'maximum 3,500 characters',
    'ui:options': {
      maxLength: MAX_TEXTAREA_LENGTH,
    },
  },
  overviewOfProjectParticipants: {
    'ui:widget': 'TextAreaWidget',
    'ui:description': 'maximum 3,500 characters',
    'ui:options': {
      maxLength: MAX_TEXTAREA_LENGTH,
    },
  },
  operationalPlan: {
    'ui:widget': 'TextAreaWidget',
    'ui:description': 'maximum 3,500 characters',
    'ui:options': {
      maxLength: MAX_TEXTAREA_LENGTH,
    },
  },
  copiesOfRegistration: {
    'ui:widget': 'FileWidget',
    'ui:description':
      'Copies of registration and other relevant documents related to incorporation, limited partnership, joint venture, not-for-profit status, etc.',
    'ui:options': {
      maxLength: MAX_LONG_INPUT_LENGTH,
      label: false,
      allowMultipleFiles: true,
    },
  },
  preparedFinancialStatements: {
    'ui:widget': 'FileWidget',
    'ui:description':
      'Independently prepared financial statements for the last three (3) years',
    'ui:options': {
      maxLength: MAX_LONG_INPUT_LENGTH,
      label: false,
      allowMultipleFiles: true,
    },
  },
  logicalNetworkDiagram: {
    'ui:widget': 'FileWidget',
    'ui:description': 'Logical network diagram',
    'ui:options': {
      maxLength: MAX_LONG_INPUT_LENGTH,
    },
  },
  projectSchedule: {
    'ui:widget': 'FileWidget',
    'ui:description': 'Project schedule (preferably a Gantt chart)',
    'ui:options': {
      maxLength: MAX_LONG_INPUT_LENGTH,
    },
  },
  communityRuralDevelopmentBenefits: {
    'ui:widget': 'FileWidget',
    'ui:description':
      'Community and Rural Development Benefits supporting documents',
    'ui:options': {
      maxLength: MAX_LONG_INPUT_LENGTH,
      allowMultipleFiles: true,
    },
  },
  geographicCoverageMap: {
    'ui:widget': 'FileWidget',
    'ui:description': `Geographic coverage map from ISED's Eligibility Mapping Tool`,
    'ui:options': {
      maxLength: MAX_LONG_INPUT_LENGTH,
    },
  },
  coverageAssessmentStatistics: {
    'ui:widget': 'FileWidget',
    'ui:description': `ISED's Eligibility Mapping Tool - Coverage Assessment and Statistics`,
    'ui:options': {
      maxLength: MAX_LONG_INPUT_LENGTH,
    },
  },
  currentNetworkInfastructure: {
    'ui:widget': 'FileWidget',
    'ui:description': 'Current Network Infrastructure',
    'ui:options': {
      maxLength: MAX_LONG_INPUT_LENGTH,
    },
  },
  upgradedNetworkInfrastructure: {
    'ui:widget': 'FileWidget',
    'ui:description':
      'Proposed or Upgraded Network Infrastructure (project specific)',
    'ui:options': {
      maxLength: MAX_LONG_INPUT_LENGTH,
    },
  },
  eligibilityAndImpactsCalculator: {
    'ui:widget': 'FileWidget',
    'ui:description': 'Template 1 - Eligibility and Impacts Calculator',
    'ui:options': {
      maxLength: MAX_LONG_INPUT_LENGTH,
      label: false,
    },
  },
  detailedBudget: {
    'ui:widget': 'FileWidget',
    'ui:description': 'Template 2 - Detailed Budget',
    'ui:options': {
      maxLength: MAX_LONG_INPUT_LENGTH,
      label: false,
    },
  },
  financialForecast: {
    'ui:widget': 'FileWidget',
    'ui:description': 'Template 3 - Financial Forecast',
    'ui:options': {
      maxLength: MAX_LONG_INPUT_LENGTH,
      label: false,
    },
  },
  lastMileIspOffering: {
    'ui:widget': 'FileWidget',
    'ui:description': 'Template 4 - Last Mile Internet Service Offering',
    'ui:options': {
      maxLength: MAX_LONG_INPUT_LENGTH,
      label: false,
    },
  },
  popWholesalePricing: {
    'ui:widget': 'FileWidget',
    'ui:description':
      'Template 5 - List of Points of Presence and Wholesale Pricing',
    'ui:options': {
      maxLength: MAX_LONG_INPUT_LENGTH,
      label: false,
    },
  },
  communityRuralDevelopmentBenefitsTemplate: {
    'ui:widget': 'FileWidget',
    'ui:description': 'Template 6 - Community and Rural Development Benefits',
    'ui:options': {
      maxLength: MAX_LONG_INPUT_LENGTH,
      label: false,
    },
  },
  evidenceOfConnectivitySpeeds: {
    'ui:widget': 'FileWidget',
    'ui:description':
      'Evidence of connectivity speeds (e.g, screen captures of speed test results)',
    'ui:options': {
      maxLength: MAX_LONG_INPUT_LENGTH,
      label: false,
      allowMultipleFiles: true,
    },
  },
  wirelessAddendum: {
    'ui:widget': 'FileWidget',
    'ui:description': 'Template 7 - Wireless Addendum',
    'ui:options': {
      maxLength: MAX_LONG_INPUT_LENGTH,
      label: false,
    },
  },
  supportingConnectivityEvidence: {
    'ui:widget': 'FileWidget',
    'ui:description': 'Template 8 - Supporting Connectivity Evidence',
    'ui:options': {
      maxLength: MAX_LONG_INPUT_LENGTH,
      label: false,
    },
  },
  geographicNames: {
    'ui:widget': 'FileWidget',
    'ui:description': 'Template 9 - Geographic Names',
    'ui:options': {
      maxLength: MAX_LONG_INPUT_LENGTH,
      label: false,
    },
  },
  equipmentDetails: {
    'ui:widget': 'FileWidget',
    'ui:description': 'Template 10 - Equipment Details',
    'ui:options': {
      maxLength: MAX_LONG_INPUT_LENGTH,
      label: false,
    },
  },
  totalEligibleCosts: {
    'ui:subtitle': 'Estimated direct employees',
    'ui:options': {
      inputType: 'money',
    },
  },
  totalProjectCost: {
    'ui:options': {
      inputType: 'money',
    },
  },
  otherFundingSources: {
    'ui:widget': 'RadioWidget',
  },
  contactEmail: {
    'ui:options': {
      inputType: 'email',
    },
  },
  contactExtension: {
    'ui:options': {
      maxLength: 9,
      inputType: 'wholeNumber',
    },
  },
  authExtension: {
    'ui:options': {
      maxLength: 9,
      inputType: 'wholeNumber',
    },
  },
  altExtension: {
    'ui:options': {
      maxLength: 9,
      inputType: 'wholeNumber',
    },
  },
  businessNumber: {
    'ui:options': {
      maxLength: 9,
      inputType: 'wholeNumber',
    },
  },
  otherFundingSourcesArray: {
    items: {
      fundingSourceContactInfo: {
        'ui:description': 'maximum 250 characters',
        'ui:options': {
          maxLength: 250,
        },
        'ui:widget': 'TextAreaWidget',
      },
      fundingPartnersName: {
        'ui:description': 'maximum 150 characters',
        'ui:options': {
          maxLength: 150,
        },
      },
      statusOfFunding: {
        'ui:widget': 'SelectWidget',
      },
      funderType: {
        'ui:widget': 'SelectWidget',
      },
      nameOfFundingProgram: {
        'ui:description': 'maximum 150 characters',
        'ui:options': {
          maxLength: 150,
        },
      },
      requestedFundingPartner2223: {
        'ui:options': {
          inputType: 'money',
        },
      },
      requestedFundingPartner2324: {
        'ui:options': {
          inputType: 'money',
        },
      },
      requestedFundingPartner2425: {
        'ui:options': {
          inputType: 'money',
        },
      },
      requestedFundingPartner2526: {
        'ui:options': {
          inputType: 'money',
        },
      },
      requestedFundingPartner2627: {
        'ui:options': {
          inputType: 'money',
        },
      },
      totalRequestedFundingPartner: {
        'ui:options': {
          inputType: 'money',
        },
      },
      // Custom array button prop that is used in ArrayFieldTemplate
      'ui:array-buttons': {
        addBtnLabel: 'Add another funding source',
        removeBtnLabel: 'Remove',
      },
      'ui:inline': [
        // This is nested so it works in this array object

        // Other funding sources page grid schema:
        {
          columns: 2,
          otherFundingSources: '1 / 2',
        },
        {
          columns: 2,
          fundingPartnersName: '1 / 2',
        },
        {
          columns: 1,
          fundingSourceContactInfo: '1 / 2',
        },
        {
          columns: 1,
          statusOfFunding: '1 / 2',
        },
        {
          columns: 1,
          funderType: '1 / 2',
        },
        {
          columns: 2,
          nameOfFundingProgram: '1 / 2',
        },
        {
          title: 'Amount requested from funding partner',
          columns: 5,
          requestedFundingPartner2223: 1,
          requestedFundingPartner2324: 2,
          requestedFundingPartner2425: 3,
          requestedFundingPartner2526: 4,
          requestedFundingPartner2627: 5,
        },
        { columns: 2, totalRequestedFundingPartner: '1 / 2' },
      ],
    },
  },
  fundingRequestedCCBC2223: {
    'ui:options': {
      inputType: 'money',
    },
  },
  fundingRequestedCCBC2324: {
    'ui:options': {
      inputType: 'money',
    },
  },
  fundingRequestedCCBC2425: {
    'ui:options': {
      inputType: 'money',
    },
  },
  fundingRequestedCCBC2526: {
    'ui:options': {
      inputType: 'money',
    },
  },
  fundingRequestedCCBC2627: {
    'ui:options': {
      inputType: 'money',
    },
  },
  totalFundingRequestedCCBC: {
    'ui:options': {
      inputType: 'money',
    },
  },
  applicationContribution2223: {
    'ui:options': {
      inputType: 'money',
    },
  },
  applicationContribution2324: {
    'ui:options': {
      inputType: 'money',
    },
  },
  applicationContribution2425: {
    'ui:options': {
      inputType: 'money',
    },
  },
  applicationContribution2526: {
    'ui:options': {
      inputType: 'money',
    },
  },
  applicationContribution2627: {
    'ui:options': {
      inputType: 'money',
    },
  },
  totalApplicantContribution: {
    'ui:options': {
      inputType: 'money',
    },
  },
  infrastructureBankFunding2223: {
    'ui:options': {
      inputType: 'money',
    },
  },
  infrastructureBankFunding2324: {
    'ui:options': {
      inputType: 'money',
    },
  },
  infrastructureBankFunding2425: {
    'ui:options': {
      inputType: 'money',
    },
  },
  infrastructureBankFunding2526: {
    'ui:options': {
      inputType: 'money',
    },
  },
  totalInfrastructureBankFunding: {
    'ui:options': {
      inputType: 'money',
    },
  },
  'ui:inline': [
    // Each object is a row for inline grid elements. Set the number of columns with column key
    // and the field key value is the gridColumn value

    // Project funding page grid schema:
    {
      title: 'Amount requested under CCBC',
      columns: 5,
      fundingRequestedCCBC2223: 1,
      fundingRequestedCCBC2324: 2,
      fundingRequestedCCBC2425: 3,
      fundingRequestedCCBC2526: 4,
      fundingRequestedCCBC2627: 5,
    },
    {
      columns: 2,
      totalFundingRequestedCCBC: '1 / 2',
    },
    {
      title: 'Amount the applicant will contribute',
      columns: 5,
      applicationContribution2223: 1,
      applicationContribution2324: 2,
      applicationContribution2425: 3,
      applicationContribution2526: 4,
      applicationContribution2627: 5,
    },
    {
      columns: 2,
      totalApplicantContribution: '1 / 2',
    },
    {
      title: 'Amount requested under Canadian Infrastructure Bank',
      columns: 5,
      infrastructureBankFunding2223: 1,
      infrastructureBankFunding2324: 2,
      infrastructureBankFunding2425: 3,
      infrastructureBankFunding2526: 4,
    },
    {
      columns: 2,
      totalInfrastructureBankFunding: '1 / 2',
    },
  ],
};

export default uiSchema;
