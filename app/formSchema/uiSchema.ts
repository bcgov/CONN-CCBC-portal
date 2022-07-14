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
    'isFirstContact',
    'altFamilyName',
    'altGivenName',
    'altPostionTitle',
    'altEmail',
    'altTelephone',
    'altExtension',
    'isAltContactSigningOfficer',
    'isAltFirstContact',
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
    'bussinessNumber',
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
    'geographicCoverageMap',
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
    'infrastructureBankFunding2627',
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
      'Geographic project area description. Describe the geographic location of the project area (i.e., include the closest communities and the general area which the project will target).',

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

  estimatedDirectEmployees: {
    'ui:subtitle': 'Estimated direct employees',
  },
  estimatedContractorLabour: {
    'ui:subtitle': 'Estimated contracted labour',
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
    },
  },
  preparedFinancialStatements: {
    'ui:widget': 'FileWidget',
    'ui:description':
      'Independently prepared financial statements for the last three (3) years',
    'ui:options': {
      maxLength: MAX_LONG_INPUT_LENGTH,
      label: false,
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
    },
  },
  geographicCoverageMap: {
    'ui:widget': 'FileWidget',
    'ui:description': `Geographic coverage map from ISED's Eligibility Mapping Tool`,
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
  },
  totalProjectCost: {},
  otherFundingSources: {
    'ui:widget': 'RadioWidget',
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
      // Custom array button prop that is used in ArrayFieldTemplate
      'ui:array-buttons': {
        addBtnLabel: 'Add another funding source',
        removeBtnLabel: 'Remove',
      },
      'ui:inline': [
        // This is nested so it works in this array object

        // Other funding sources page grid schema:
        {
          otherFundingSources: 'full',
        },
        {
          fundingPartnersName: 'full',
        },
        {
          fundingSourceContactInfo: 'full',
        },
        {
          statusOfFunding: 'full',
        },
        {
          funderType: 'full',
        },
        {
          nameOfFundingProgram: 'full',
        },
        {
          title: 'Amount requested from funding partner',
          requestedFundingPartner2223: 'inline',
          requestedFundingPartner2324: 'inline',
          requestedFundingPartner2425: 'inline',
          requestedFundingPartner2526: 'inline',
          requestedFundingPartner2627: 'inline',
        },
        { totalRequestedFundingPartner: 'full' },
      ],
    },
  },
  'ui:inline': [
    // Each object is a row for inline grid elements. Single elements with 'full' value
    // will properly format the input width for a single input.

    // Project funding page grid schema:
    {
      title: 'Amount requested under CCBC',
      fundingRequestedCCBC2223: 'inline',
      fundingRequestedCCBC2324: 'inline',
      fundingRequestedCCBC2425: 'inline',
      fundingRequestedCCBC2526: 'inline',
      fundingRequestedCCBC2627: 'inline',
    },
    {
      totalFundingRequestedCCBC: 'full',
    },
    {
      title: 'Amount the applicant will contribute',
      applicationContribution2223: 'inline',
      applicationContribution2324: 'inline',
      applicationContribution2425: 'inline',
      applicationContribution2526: 'inline',
      applicationContribution2627: 'inline',
    },
    {
      totalApplicantContribution: 'full',
    },
    {
      title: 'Amount requested under Canadian Infrastructure Bank',
      infrastructureBankFunding2223: 'inline',
      infrastructureBankFunding2324: 'inline',
      infrastructureBankFunding2425: 'inline',
      infrastructureBankFunding2526: 'inline',
      infrastructureBankFunding2627: 'inline',
    },
    {
      totalInfrastructureBankFunding: 'full',
    },
    // Other funding sources page grid schema:
    {
      otherFundingSources: 'full',
    },
    {
      fundingPartnersName: 'full',
    },
    {
      fundingSourceContactInfo: 'full',
    },
    {
      statusOfFunding: 'full',
    },
    {
      funderType: 'full',
    },
    {
      nameOfFundingProgram: 'full',
    },
    {
      title: 'Amount requested from funding partner',
      requestedFundingPartner2223: 'inline',
      requestedFundingPartner2324: 'inline',
      requestedFundingPartner2425: 'inline',
      requestedFundingPartner2526: 'inline',
      requestedFundingPartner2627: 'inline',
    },
    { totalRequestedFundingPartner: 'full' },
  ],
};

export default uiSchema;
