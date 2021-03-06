const mockFormData = {
  mapping: {
    geographicCoverageMap:
      '[{"uuid":"d56a8477-b4d8-43c7-bd75-75d376ddeca4","name":"File.pdf","size":35,"type":"text/plain"}]',
    currentNetworkInfastructure:
      '[{"uuid":"d56a8477-b4d8-43c7-bd75-75d376ddeca4","name":"File.pdf","size":35,"type":"text/plain"}]',
    upgradedNetworkInfrastructure:
      '[{"uuid":"d56a8477-b4d8-43c7-bd75-75d376ddeca4","name":"File.pdf","size":35,"type":"text/plain"}]',
  },
  benefits: {
    projectBenefits: '213123123',
    numberOfHouseholds: '123123123',
  },
  projectArea: {
    geographicArea: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
    provincesTerritories: ['Alberta', 'Northwest Territories'],
    projectSpanMultipleLocations: 'Yes',
  },
  projectPlan: {
    operationalPlan: '12312312312',
    projectStartDate: '2022-06-10',
    projectCompletionDate: '2022-06-08',
    relationshipManagerApplicant: '123213123123``',
    overviewOfProjectParticipants: '123123123123',
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
    scalability: '123123123',
    systemDesign: '123123123',
    backboneTechnology: ['Fibre', 'Microwave', 'Satellite'],
    lastMileTechnology: ['Fibre', 'Cable', 'Fixed wireless', 'DSL'],
  },
  budgetDetails: {
    totalProjectCost: 1231231231231,
    totalEligibleCosts: 213123123,
  },
  projectFunding: {
    fundingRequestedCCBC2223: '123123',
    fundingRequestedCCBC2324: '123123',
    fundingRequestedCCBC2425: '123123',
    fundingRequestedCCBC2526: '123123',
    fundingRequestedCCBC2627: '123123',
    totalFundingRequestedCCBC: '123123',
    totalApplicantContribution: '123123123',
    applicationContribution2223: '1231231',
    applicationContribution2324: '123123123',
    applicationContribution2425: '123123123',
    applicationContribution2526: '123123',
    applicationContribution2627: '1223123123',
    infrastructureBankFunding2223: '123123123',
    infrastructureBankFunding2324: '123123132',
    infrastructureBankFunding2425: '123123',
    infrastructureBankFunding2526: '123123',
    infrastructureBankFunding2627: '1231231',
    totalInfrastructureBankFunding: '31213',
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
    altExtension: 123,
    altGivenName: 'test',
    altTelephone: 7899798,
    altFamilyName: 'test',
    altPostionTitle: '798798',
    isAltFirstContact: true,
    isAltContactSigningOfficer: true,
  },
  authorizedContact: {
    authEmail: '79879',
    authExtension: 789,
    authGivenName: '89798',
    authTelephone: 7897,
    authFamilyName: '123123',
    isFirstContact: true,
    authPostionTitle: '798798',
    isAuthContactSigningOfficer: true,
  },
  contactInformation: {
    contactEmail: '123123',
    contactWebsite: '123123',
    contactExtension: 123123,
    contactTelephoneNumber: 123123,
  },
  projectInformation: {
    projectTitle: '234234234',
    projectDescription: '324234234',
    geographicAreaDescription: '234234234',
  },
  organizationProfile: {
    isSubsidiary: 'Yes',
    operatingName: '123123123',
    parentOrgName: '213123123',
    businessNumber: 123123123,
    isNameLegalName: 'No',
    organizationName: '2143123123',
    isIndigenousEntity: 'Yes',
    isLegalPrimaryName: 'No',
    typeOfOrganization: 'Incorporated company - private of public',
    orgRegistrationDate: '2022-05-31',
    indigenousEntityDesc: '1231231231',
    organizationOverview: '123123123',
  },
  otherFundingSources: {
    otherFundingSources: 'Yes',
    otherFundingSourcesArray: [
      {
        funderType: 'Provincial/territorial',
        statusOfFunding: 'Submitted',
        fundingPartnersName: 'asdsad',
        nameOfFundingProgram: '123123123',
        fundingSourceContactInfo: '123123123',
        requestedFundingPartner2223: '123123',
        requestedFundingPartner2324: '123123',
        requestedFundingPartner2425: '123123',
        requestedFundingPartner2526: 'supportingDocumentsSchema123123',
        requestedFundingPartner2627: '123123',
        totalRequestedFundingPartner: '123123123123',
      },
      {
        funderType: 'Provincial/territorial',
        statusOfFunding: 'Submitted',
        fundingPartnersName: 'asdasd',
        nameOfFundingProgram: '123123',
        fundingSourceContactInfo: '123123123',
        requestedFundingPartner2223: '213123',
        requestedFundingPartner2324: '123123',
        requestedFundingPartner2425: '123123',
        requestedFundingPartner2526: '1233123',
        requestedFundingPartner2627: '123123',
        totalRequestedFundingPartner: '1231223',
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
    isMailingAddress: 'No',
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
    isInfrastuctureAvailable: true,
    hasProvidedExitingNetworkCoverage:
      'I will provide existing network information and/or Coverage to ISED by the application deadline',
    requiresThirdPartyInfrastructureAccess: true,
  },
  estimatedProjectEmployment: {
    currentEmployment: '2231231231',
    numberOfEmployeesToWork: '7687',
    personMonthsToBeCreated: '897798',
    estimatedDirectEmployees: {},
    hoursOfEmploymentPerWeek: '6876',
    estimatedContractorLabour: {},
    numberOfContractorsToWork: '9808987',
    contractorPersonMonthsToBeCreated: '789798',
    hoursOfContractorEmploymentPerWeek: '789978',
  },
};

export default mockFormData;
