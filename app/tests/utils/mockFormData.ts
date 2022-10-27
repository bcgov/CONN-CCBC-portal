import { acknowledgementsEnum } from 'formSchema/pages/acknowledgements';

const mockFormData = {
  coverage: {
    geographicCoverageMap:
      '[{"uuid":"d56a8477-b4d8-43c7-bd75-75d376ddeca4","name":"File.pdf","size":35,"type":"text/plain"}]',
    currentNetworkInfastructure:
      '[{"uuid":"d56a8477-b4d8-43c7-bd75-75d376ddeca4","name":"File.pdf","size":35,"type":"text/plain"}]',
    upgradedNetworkInfrastructure:
      '[{"uuid":"d56a8477-b4d8-43c7-bd75-75d376ddeca4","name":"File.pdf","size":35,"type":"text/plain"}]',
    coverageAssessmentStatistics:
      '[{"uuid":"d56a8477-b4d8-43c7-bd75-75d376ddeca4","name":"File.pdf","size":35,"type":"text/plain"}]',
  },
  benefits: {
    projectBenefits: '213123123',
    numberOfHouseholds: 42,
    householdsImpactedIndigenous: 21,
  },
  projectArea: {
    geographicArea: [1, 9, 10],
    provincesTerritories: ['Alberta', 'Northwest Territories'],
    projectSpanMultipleLocations: true,
  },
  projectPlan: {
    operationalPlan: '12312312312',
    projectStartDate: '2022-06-10',
    projectCompletionDate: '2022-06-08',
    relationshipManagerApplicant: '123213123123``',
    overviewOfProjectParticipants: '123123123123',
    overviewProjectManagementTeam: 'Some dudes',
  },
  declarations: {
    declarationsList: [
      'The Applicant confirms that it is under no obligation or prohibition, nor is it subject to, or threatened by any actions, suits or proceedings, which\n          could or would affect its ability to implement this proposed project.',
      'The Applicant confirms that it authorizes the Program to make enquiries of such persons, firms, corporations, federal and provincial government\n          agencies/departments and non-profit organizations, to collect and share with them, as the Program deems necessary in order to reach a decision\n          on this proposed project.',
      'The Applicant confirms that any person, who is required to be registered pursuant to the Lobbying Act including consultant and in-house lobbyists,\n            is registered pursuant to that Act, and is in compliance with the provisions of the Act.',
      'The Applicant recognizes that the project may require an impact assessment under the Impact Assessment Act 2019.',
      'The Applicant recognizes that there is a duty to consult Indigenous groups if a federally funded project will undertake infrastructure in, or affecting,\n            an Indigenous community.',
    ],
  },
  techSolution: {
    scalability: 'much scalable',
    systemDesign: 'design of system',
    backboneTechnology: ['Fibre', 'Satellite'],
    lastMileTechnology: ['Fibre', 'Fixed wireless'],
  },
  budgetDetails: {
    totalProjectCost: 1230,
    totalEligibleCosts: 1000,
  },
  projectFunding: {
    fundingRequestedCCBC2223: 10,
    fundingRequestedCCBC2324: 20,
    fundingRequestedCCBC2425: 30,
    fundingRequestedCCBC2526: 40,
    fundingRequestedCCBC2627: 50,
    totalFundingRequestedCCBC: 150,
    totalApplicantContribution: 15,
    applicationContribution2223: 1,
    applicationContribution2324: 2,
    applicationContribution2425: 3,
    applicationContribution2526: 4,
    applicationContribution2627: 5,
  },
  templateUploads: {
    detailedBudget:
      '[{"uuid":"d56a8477-b4d8-43c7-bd75-75d376ddeca4","name":"File.pdf","size":35,"type":"text/plain"}]',
    geographicNames:
      '[{"uuid":"d56a8477-b4d8-43c7-bd75-75d376ddeca4","name":"File.pdf","size":35,"type":"text/plain"}]',
    equipmentDetails:
      '[{"uuid":"d56a8477-b4d8-43c7-bd75-75d376ddeca4","name":"File.pdf","size":35,"type":"text/plain"}]',
    wirelessAddendum:
      '[{"uuid":"d56a8477-b4d8-43c7-bd75-75d376ddeca4","name":"File.pdf","size":35,"type":"text/plain"}]',
    financialForecast:
      '[{"uuid":"d56a8477-b4d8-43c7-bd75-75d376ddeca4","name":"File.pdf","size":35,"type":"text/plain"}]',
    lastMileIspOffering:
      '[{"uuid":"d56a8477-b4d8-43c7-bd75-75d376ddeca4","name":"File.pdf","size":35,"type":"text/plain"}]',
    popWholesalePricing:
      '[{"uuid":"d56a8477-b4d8-43c7-bd75-75d376ddeca4","name":"File.pdf","size":35,"type":"text/plain"}]',
    supportingConnectivityEvidence:
      '[{"uuid":"d56a8477-b4d8-43c7-bd75-75d376ddeca4","name":"File.pdf","size":35,"type":"text/plain"}]',
    eligibilityAndImpactsCalculator:
      '[{"uuid":"d56a8477-b4d8-43c7-bd75-75d376ddeca4","name":"File.pdf","size":35,"type":"text/plain"}]',
    communityRuralDevelopmentBenefitsTemplate:
      '[{"uuid":"d56a8477-b4d8-43c7-bd75-75d376ddeca4","name":"File.pdf","size":35,"type":"text/plain"}]',
  },
  alternateContact: {
    altEmail: 'test@test.com',
    altExtension: '123',
    altGivenName: 'test',
    altTelephone: '7899798123',
    altFamilyName: 'test',
    altPositionTitle: 'some alt title',
    isAltFirstContact: true,
    isAltContactSigningOfficer: true,
  },
  authorizedContact: {
    authEmail: '79879',
    authExtension: '789',
    authGivenName: 'Bob',
    authTelephone: '123123123',
    authFamilyName: '123123',
    isFirstContact: true,
    authPositionTitle: 'Some title',
    isAuthContactSigningOfficer: true,
  },
  contactInformation: {
    contactEmail: 'bob@loblaw.ca',
    contactWebsite: 'loblaw.ca',
    contactExtension: '123',
    contactTelephoneNumber: '123123123',
  },
  projectInformation: {
    projectTitle: '234234234',
    projectDescription: '324234234',
    geographicAreaDescription: '234234234',
  },
  organizationProfile: {
    isSubsidiary: true,
    operatingName: 'op name',
    parentOrgName: 'parent org',
    businessNumber: '123123123',
    isNameLegalName: false,
    organizationName: 'org name',
    isIndigenousEntity: true,
    isLegalPrimaryName: false,
    typeOfOrganization: 'Incorporated company - private or public',
    orgRegistrationDate: '2022-05-31',
    indigenousEntityDesc: 'ind entity',
    organizationOverview: 'org overview',
  },
  otherFundingSources: {
    infrastructureBankFunding2223: 1,
    infrastructureBankFunding2324: 2,
    infrastructureBankFunding2425: 3,
    infrastructureBankFunding2526: 4,
    infrastructureBankFunding2627: 5,
    totalInfrastructureBankFunding: 15,
    otherFundingSources: true,
    otherFundingSourcesArray: [
      {
        funderType: 'Provincial/territorial',
        statusOfFunding: 'Submitted',
        fundingPartnersName: 'asdsad',
        nameOfFundingProgram: '123123123',
        fundingSourceContactInfo: '123123123',
        requestedFundingPartner2223: 10,
        requestedFundingPartner2324: 20,
        requestedFundingPartner2425: 30,
        requestedFundingPartner2526: 40,
        requestedFundingPartner2627: 50,
        totalRequestedFundingPartner: 150,
      },
      {
        funderType: 'Provincial/territorial',
        statusOfFunding: 'Submitted',
        fundingPartnersName: 'asdasd',
        nameOfFundingProgram: '123123',
        fundingSourceContactInfo: '123123123',
        requestedFundingPartner2223: 100,
        requestedFundingPartner2324: 200,
        requestedFundingPartner2425: 300,
        requestedFundingPartner2526: 400,
        requestedFundingPartner2627: 500,
        totalRequestedFundingPartner: 1500,
      },
    ],
  },
  supportingDocuments: {
    projectSchedule:
      '[{"uuid":"d56a8477-b4d8-43c7-bd75-75d376ddeca4","name":"File.pdf","size":35,"type":"text/plain"}]',
    copiesOfRegistration:
      '[{"uuid":"d56a8477-b4d8-43c7-bd75-75d376ddeca4","name":"File.pdf","size":35,"type":"text/plain"}]',
    logicalNetworkDiagram:
      '[{"uuid":"d56a8477-b4d8-43c7-bd75-75d376ddeca4","name":"File.pdf","size":35,"type":"text/plain"}]',
    preparedFinancialStatements:
      '[{"uuid":"d56a8477-b4d8-43c7-bd75-75d376ddeca4","name":"File.pdf","size":35,"type":"text/plain"}]',
    communityRuralDevelopmentBenefits:
      '[{"uuid":"d56a8477-b4d8-43c7-bd75-75d376ddeca4","name":"File.pdf","size":35,"type":"text/plain"}]',
  },
  organizationLocation: {
    city: 'Victoria',
    POBox: '123123',
    province: 'British Columbia',
    postalCode: '123123',
    streetName: '123123',
    unitNumber: '1231231',
    streetNumber: 123123,
    isMailingAddress: false,
    mailingAddress: {
      cityMailing: 'Victoria',
      POBoxMailing: '123',
      provinceMailing: 'British Columbia',
      postalCodeMailing: '123',
      streetNameMailing: '123',
      unitNumberMailing: '123',
      streetNumberMailing: '1232',
    },
  },
  existingNetworkCoverage: {
    hasPassiveInfrastructure: true,
    isInfrastructureAvailable: true,
    hasProvidedExitingNetworkCoverage:
      'I will provide existing Network information and/or Coverage to ISED by the application deadline',
    requiresThirdPartyInfrastructureAccess: true,
  },
  estimatedProjectEmployment: {
    currentEmployment: 1,
    numberOfEmployeesToWork: 1,
    personMonthsToBeCreated: 1,
    hoursOfEmploymentPerWeek: 0.1,
    numberOfContractorsToWork: 1,
    contractorPersonMonthsToBeCreated: 1,
    hoursOfContractorEmploymentPerWeek: 1,
  },
  acknowledgements: {
    acknowledgementsList: [
      acknowledgementsEnum[0],
      acknowledgementsEnum[1],
      acknowledgementsEnum[2],
      acknowledgementsEnum[3],
      acknowledgementsEnum[4],
      acknowledgementsEnum[5],
      acknowledgementsEnum[6],
      acknowledgementsEnum[7],
      acknowledgementsEnum[8],
      acknowledgementsEnum[9],
      acknowledgementsEnum[10],
      acknowledgementsEnum[11],
      acknowledgementsEnum[12],
      acknowledgementsEnum[13],
      acknowledgementsEnum[14],
      acknowledgementsEnum[15],
      acknowledgementsEnum[16],
    ],
  },
  submission: {
    submissionDate: '2022-10-26',
    submissionTitle: 'Test Title',
    submissionCompletedBy: 'Test Person',
    submissionCompletedFor: 'Test Company',
  },
};

export default mockFormData;
