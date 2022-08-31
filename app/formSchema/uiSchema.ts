import {
  MoneyWidget,
  NumberWidget,
  ReadOnlyWidget,
} from '../lib/theme/widgets';

const MAX_TEXTAREA_LENGTH = 3500;
const MAX_LONG_INPUT_LENGTH = 200;
const MAX_CONTACT_INPUT_LENGTH = 128;
const MAX_MED_INPUT_LENGTH = 75;
const MAX_SHORT_INPUT_LENGTH = 9;
const MIN_INPUT_LENGTH = 1;
const MAX_LENGTH_POSTAL_CODE = 6;

const EXCEL_FILE_EXTENSIONS = '.xls, .xlsx';

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
    'authPositionTitle',
    'authEmail',
    'authTelephone',
    'authExtension',
    'isAuthContactSigningOfficer',
    'altFamilyName',
    'altGivenName',
    'altPositionTitle',
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
    'numberOfEmployeesToWork',
    'hoursOfEmploymentPerWeek',
    'personMonthsToBeCreated',
    'estimatedFTECreation',
    'numberOfContractorsToWork',
    'hoursOfContractorEmploymentPerWeek',
    'contractorPersonMonthsToBeCreated',
    'estimatedFTEContractorCreation',
    'acknowledgementsList',
    'submissionCompletedFor',
    'submissionDate',
    'submissionCompletedBy',
    'submissionTitle',
    'systemDesign',
    'scalability',
    'backboneTechnology',
    'lastMileTechnology',
    'projectBenefits',
    'numberOfHouseholds',
    'householdsImpactedIndigenous',
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
    'otherSupportingMaterials',
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
  'ui:title': '',
  projectTitle: {
    'ui:description': 'maximum 200 characters',
    'ui:title':
      'Project title. Be descriptive about the geographic region. Please refrain from using years in the title.',
    'ui:options': {
      maxLength: MAX_LONG_INPUT_LENGTH,
    },
  },
  geographicAreaDescription: {
    'ui:description': 'maximum 150 characters',
    'ui:title':
      'Describe the geographic location of the Project area (i.e., include the closest communities and the general area which the Project will target).',
    'ui:options': {
      maxLength: 150,
    },
  },
  projectDescription: {
    'ui:widget': 'TextAreaWidget',
    'ui:description': 'maximum 3,500 characters',
    'ui:title':
      'Using non-technical language, provide a description of the Project, including its key elements, purpose, objectives and benefits. Identify the ‘who’, ‘what’, ‘where’, ‘when’ and ‘why’. Please avoid including Confidential or Proprietary information.',

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
  timeMachine: {
    'ui:widget': 'DatePickerWidget',
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
  authFamilyName: {
    'ui:options': {
      maxLength: MAX_CONTACT_INPUT_LENGTH,
      altOptionalText: 'if applicable',
    },
  },
  authGivenName: {
    'ui:options': {
      maxLength: MAX_CONTACT_INPUT_LENGTH,
    },
  },
  authPositionTitle: {
    'ui:options': {
      maxLength: MAX_CONTACT_INPUT_LENGTH,
    },
  },
  authEmail: {
    'ui:options': {
      inputType: 'email',
      maxLength: MAX_CONTACT_INPUT_LENGTH,
    },
  },
  authTelephone: {
    'ui:widget': NumberWidget,
    'ui:options': {
      inputType: 'phone',
    },
  },
  authExtension: {
    'ui:widget': NumberWidget,
    'ui:options': {
      maxLength: 9,
      inputType: 'wholeNumber',
    },
  },
  altFamilyName: {
    'ui:options': {
      maxLength: MAX_CONTACT_INPUT_LENGTH,
      altOptionalText: 'if applicable',
    },
  },
  altGivenName: {
    'ui:options': {
      maxLength: MAX_CONTACT_INPUT_LENGTH,
    },
  },
  altPositionTitle: {
    'ui:options': {
      maxLength: MAX_CONTACT_INPUT_LENGTH,
    },
  },
  altEmail: {
    'ui:options': {
      inputType: 'email',
      maxLength: MAX_CONTACT_INPUT_LENGTH,
    },
  },
  altTelephone: {
    'ui:widget': NumberWidget,
    'ui:options': {
      inputType: 'phone',
    },
  },
  altExtension: {
    'ui:widget': NumberWidget,
    'ui:options': {
      maxLength: 9,
      inputType: 'wholeNumber',
    },
  },
  contactTelephoneNumber: {
    'ui:widget': NumberWidget,
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
    'ui:widget': NumberWidget,
    'ui:options': {
      maxLength: 7,
      commaSeparator: true,
      decimals: 0,
    },
  },
  numberOfEmployeesToWork: {
    'ui:widget': NumberWidget,
    'ui:options': {
      commaSeparator: true,
      decimals: 0,
    },
  },
  hoursOfEmploymentPerWeek: {
    'ui:widget': NumberWidget,
    'ui:options': {
      commaSeparator: true,
      decimals: 1,
    },
  },
  personMonthsToBeCreated: {
    'ui:widget': NumberWidget,
    'ui:options': {
      commaSeparator: true,
      decimals: 1,
    },
  },
  estimatedFTECreation: {
    'ui:widget': ReadOnlyWidget,
    'ui:options': {
      hideOptional: true,
    },
  },
  numberOfContractorsToWork: {
    'ui:widget': NumberWidget,
    'ui:options': {
      commaSeparator: true,
      decimals: 0,
    },
  },
  hoursOfContractorEmploymentPerWeek: {
    'ui:widget': NumberWidget,
    'ui:options': {
      commaSeparator: true,
      decimals: 1,
    },
  },
  contractorPersonMonthsToBeCreated: {
    'ui:widget': NumberWidget,
    'ui:options': {
      commaSeparator: true,
      decimals: 1,
    },
  },
  estimatedFTEContractorCreation: {
    'ui:widget': ReadOnlyWidget,
    'ui:options': {
      hideOptional: true,
    },
  },
  acknowledgementsList: {
    'ui:title': ` `,
    'ui:widget': 'CheckboxesWidget',
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
    'ui:widget': NumberWidget,
    'ui:options': {
      inputType: 'wholeNumber',
      label: false,
    },
  },
  householdsImpactedIndigenous: {
    'ui:widget': NumberWidget,
    'ui:options': {
      inputType: 'wholeNumber',
      label: false,
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
    'ui:description': 'maximum 2,500 characters',
    'ui:options': {
      maxLength: 2500,
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
    'ui:description': 'Logical Network Diagram',
    'ui:options': {
      maxLength: MAX_LONG_INPUT_LENGTH,
      allowMultipleFiles: true,
      fileTypes:
        '.pdf, .png, .jpg, .jpeg, .vsd, .vsdx, .doc, .docx, .ppt, .pptx',
    },
  },
  projectSchedule: {
    'ui:widget': 'FileWidget',
    'ui:description': 'Project schedule (preferably a Gantt chart)',
    'ui:options': {
      allowMultipleFiles: true,
      maxLength: MAX_LONG_INPUT_LENGTH,
      fileTypes: `${EXCEL_FILE_EXTENSIONS}, .mpp`,
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
    'ui:description': `Geographic coverage map from ISED's Eligibility Mapping Tool. KMZ is required.`,
    'ui:options': {
      maxLength: MAX_LONG_INPUT_LENGTH,
      fileTypes: '.kmz',
    },
  },
  coverageAssessmentStatistics: {
    'ui:widget': 'FileWidget',
    'ui:description': `ISED's Eligibility Mapping Tool - Coverage Assessment and Statistics`,
    'ui:options': {
      maxLength: MAX_LONG_INPUT_LENGTH,
      fileTypes: `.eml, .msg, .txt, .pdf, .doc, .docx, .xml, .jpg, .jpeg, .png, ${EXCEL_FILE_EXTENSIONS}`,
    },
  },
  currentNetworkInfastructure: {
    'ui:widget': 'FileWidget',
    'ui:description': 'Current network infrastructure in a geo-coded format',
    'ui:options': {
      maxLength: MAX_LONG_INPUT_LENGTH,
      allowMultipleFiles: true,
      fileTypes: '.kml, .kmz',
    },
  },
  upgradedNetworkInfrastructure: {
    'ui:widget': 'FileWidget',
    'ui:description':
      'Proposed or Upgraded Network Infrastructure (project-specific) in a geo-coded format',
    'ui:options': {
      maxLength: MAX_LONG_INPUT_LENGTH,
      allowMultipleFiles: true,
      fileTypes: '.kml, .kmz',
    },
  },
  eligibilityAndImpactsCalculator: {
    'ui:widget': 'FileWidget',
    'ui:description': 'Template 1 - Eligibility and Impacts Calculator',
    'ui:options': {
      maxLength: MAX_LONG_INPUT_LENGTH,
      label: false,
      fileTypes: EXCEL_FILE_EXTENSIONS,
    },
  },
  detailedBudget: {
    'ui:widget': 'FileWidget',
    'ui:description': 'Template 2 - Detailed Budget',
    'ui:options': {
      maxLength: MAX_LONG_INPUT_LENGTH,
      label: false,
      fileTypes: EXCEL_FILE_EXTENSIONS,
    },
  },
  financialForecast: {
    'ui:widget': 'FileWidget',
    'ui:description': 'Template 3 - Financial Forecast',
    'ui:options': {
      maxLength: MAX_LONG_INPUT_LENGTH,
      label: false,
      fileTypes: EXCEL_FILE_EXTENSIONS,
    },
  },
  lastMileIspOffering: {
    'ui:widget': 'FileWidget',
    'ui:description': 'Template 4 - Last Mile Internet Service Offering',
    'ui:options': {
      maxLength: MAX_LONG_INPUT_LENGTH,
      label: false,
      fileTypes: EXCEL_FILE_EXTENSIONS,
    },
  },
  popWholesalePricing: {
    'ui:widget': 'FileWidget',
    'ui:description':
      'Template 5 - List of Points of Presence and Wholesale Pricing (if applicable)',
    'ui:options': {
      maxLength: MAX_LONG_INPUT_LENGTH,
      label: false,
      fileTypes: EXCEL_FILE_EXTENSIONS,
    },
  },
  communityRuralDevelopmentBenefitsTemplate: {
    'ui:widget': 'FileWidget',
    'ui:description': 'Template 6 - Community and Rural Development Benefits',
    'ui:options': {
      maxLength: MAX_LONG_INPUT_LENGTH,
      label: false,
      fileTypes: EXCEL_FILE_EXTENSIONS,
    },
  },
  otherSupportingMaterials: {
    'ui:widget': 'FileWidget',
    'ui:description': 'Other supporting materials',
    'ui:options': {
      maxLength: MAX_LONG_INPUT_LENGTH,
      allowMultipleFiles: true,
      altOptionalText: 'if applicable',
    },
  },
  wirelessAddendum: {
    'ui:widget': 'FileWidget',
    'ui:description': 'Template 7 - Wireless Addendum (if applicable)',
    'ui:options': {
      maxLength: MAX_LONG_INPUT_LENGTH,
      label: false,
      fileTypes: EXCEL_FILE_EXTENSIONS,
    },
  },
  supportingConnectivityEvidence: {
    'ui:widget': 'FileWidget',
    'ui:description':
      'Template 8 - Supporting Connectivity Evidence (if applicable)',
    'ui:options': {
      maxLength: MAX_LONG_INPUT_LENGTH,
      label: false,
      fileTypes: EXCEL_FILE_EXTENSIONS,
    },
  },
  geographicNames: {
    'ui:widget': 'FileWidget',
    'ui:description': 'Template 9 - Geographic Names',
    'ui:options': {
      maxLength: MAX_LONG_INPUT_LENGTH,
      label: false,
      fileTypes: EXCEL_FILE_EXTENSIONS,
    },
  },
  equipmentDetails: {
    'ui:widget': 'FileWidget',
    'ui:description': 'Template 10 - Equipment Details',
    'ui:options': {
      maxLength: MAX_LONG_INPUT_LENGTH,
      label: false,
      fileTypes: EXCEL_FILE_EXTENSIONS,
    },
  },
  totalEligibleCosts: {
    'ui:widget': MoneyWidget,
    'ui:subtitle': 'Estimated direct employees',
    'ui:options': {
      inputType: 'money',
    },
  },
  totalProjectCost: {
    'ui:widget': MoneyWidget,
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
    'ui:widget': NumberWidget,
    'ui:options': {
      maxLength: 9,
      inputType: 'wholeNumber',
    },
  },
  businessNumber: {
    'ui:widget': NumberWidget,
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
          altOptionalText: 'if applicable',
        },
      },
      requestedFundingPartner2223: {
        'ui:widget': MoneyWidget,
      },
      requestedFundingPartner2324: {
        'ui:widget': MoneyWidget,
      },
      requestedFundingPartner2425: {
        'ui:widget': MoneyWidget,
      },
      requestedFundingPartner2526: {
        'ui:widget': MoneyWidget,
      },
      requestedFundingPartner2627: {
        'ui:widget': MoneyWidget,
      },
      totalRequestedFundingPartner: {
        'ui:widget': MoneyWidget,
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
          title:
            'Amount requested from funding partner per fiscal year (April 1 - March 31)',
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
    'ui:widget': MoneyWidget,
  },
  fundingRequestedCCBC2324: {
    'ui:widget': MoneyWidget,
  },
  fundingRequestedCCBC2425: {
    'ui:widget': MoneyWidget,
  },
  fundingRequestedCCBC2526: {
    'ui:widget': MoneyWidget,
  },
  fundingRequestedCCBC2627: {
    'ui:widget': MoneyWidget,
  },
  totalFundingRequestedCCBC: {
    'ui:widget': MoneyWidget,
  },
  applicationContribution2223: {
    'ui:widget': MoneyWidget,
  },
  applicationContribution2324: {
    'ui:widget': MoneyWidget,
  },
  applicationContribution2425: {
    'ui:widget': MoneyWidget,
  },
  applicationContribution2526: {
    'ui:widget': MoneyWidget,
  },
  applicationContribution2627: {
    'ui:widget': MoneyWidget,
  },
  totalApplicantContribution: {
    'ui:widget': MoneyWidget,
  },
  infrastructureBankFunding2223: {
    'ui:widget': MoneyWidget,
    'ui:options': {
      hideOptional: true,
    },
  },
  infrastructureBankFunding2324: {
    'ui:widget': MoneyWidget,
    'ui:options': {
      hideOptional: true,
    },
  },
  infrastructureBankFunding2425: {
    'ui:widget': MoneyWidget,
    'ui:options': {
      hideOptional: true,
    },
  },
  infrastructureBankFunding2526: {
    'ui:widget': MoneyWidget,
    'ui:options': {
      hideOptional: true,
    },
  },
  totalInfrastructureBankFunding: {
    'ui:widget': MoneyWidget,
    'ui:options': {
      hideOptional: true,
    },
  },
  review: {
    'ui:field': 'ReviewField',
  },
  submission: {
    'ui:field': 'SubmissionField',
    submissionDate: {
      'ui:widget': 'DatePickerWidget',
    },
  },
  'ui:inline': [
    // Each object is a row for inline grid elements. Set the number of columns with column key
    // and the field key value is the gridColumn value

    // Project funding page grid schema:
    {
      title: 'Amount requested under CCBC per fiscal year (April 1 - March 31)',
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
      title:
        'Amount the applicant will contribute per fiscal year (April 1 - March 31)',
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
      title:
        'Funding from Canadian Infrastructure Bank per fiscal year (April 1 - March 31) (if applicable)',
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
    {
      columns: 1,
      currentEmployment: '1 / 2',
    },
    {
      title: 'Estimated direct employees',
      headline: true,
      columns: 4,
      numberOfEmployeesToWork: 1,
      hoursOfEmploymentPerWeek: 2,
      personMonthsToBeCreated: 3,
      estimatedFTECreation: 4,
    },
    {
      title: 'Estimated contracted labour',
      headline: true,
      columns: 4,
      numberOfContractorsToWork: 1,
      hoursOfContractorEmploymentPerWeek: 2,
      contractorPersonMonthsToBeCreated: 3,
      estimatedFTEContractorCreation: 4,
    },
  ],
};

export default uiSchema;
