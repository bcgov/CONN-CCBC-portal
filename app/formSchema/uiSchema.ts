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
    'totalEligbleCosts',
    'totalProjectCost',
    'requestedCCBCFunding',
    'fundingRequested2223',
    'fundingRequested2324',
    'fundingRequested2425',
    'fundingRequested2526',
    'fundingRequested2627',
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
      'Using non-technical language, provide a description of the project, including its key elements, purpose, objectives, and benefits. Identify the ‘who’, ‘what’, ‘where’, ‘when’, and ‘why’. Please avoid including confidential or proprietary information.',

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
    'ui:title': ' ',
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
};

export default uiSchema;
