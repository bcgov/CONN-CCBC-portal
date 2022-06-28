import { Review } from '../../../components/Review';
import { render, screen } from '@testing-library/react';
import React from 'react';

import {
  alternateContact,
  authorizedContact,
  benefits,
  budgetDetails,
  contactInformation,
  estimatedProjectEmployment,
  declarations,
  declarationsSign,
  existingNetworkCoverage,
  mapping,
  organizationLocation,
  organizationProfile,
  otherFundingSources,
  projectArea,
  projectInformation,
  projectFunding,
  projectPlan,
  supportingDocuments,
  review,
  techSolution,
  templateUploads,
} from '../../../formSchema/pages';

// This can be removed and directly imported once GrowthBook feature flagging is removed from form schema
const schema = {
  type: 'object',
  properties: {
    ...projectInformation,
    ...projectArea,
    ...existingNetworkCoverage,
    ...budgetDetails,
    ...projectFunding,
    ...otherFundingSources,
    ...techSolution,
    ...benefits,
    ...projectPlan,
    ...templateUploads,
    ...supportingDocuments,
    ...mapping,
    ...estimatedProjectEmployment,
    ...organizationProfile,
    ...organizationLocation,
    ...contactInformation,
    ...authorizedContact,
    ...alternateContact,
    ...review,
    ...declarations,
    ...declarationsSign,
  },
};

const mockFormData = {
  mapping: {
    geographicCoverageMap: 'FileWidget.js',
    currentNetworkInfastructure: 'TextareaWidget.js',
    upgradedNetworkInfrastructure: 'TextWidget.js',
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
    detailedBudget: 'AltDateWidget.js',
    geographicNames: 'TextareaWidget.js',
    equipmentDetails: 'UpDownWidget.js',
    wirelessAddendum: 'SelectWidget.js',
    financialForecast: 'AltDateWidget.js',
    lastMileIspOffering: 'FileWidget.js',
    popWholesalePricing: 'RangeWidget.js',
    supportingConnectivityEvidence: 'SubmitButton.js',
    eligibilityAndImpactsCalculator: 'AltDateWidget.js',
    communityRuralDevelopmentBenefitsTemplate: 'RangeWidget.js',
  },
  alternateContact: {
    altEmail: '78798',
    altExtension: 78798,
    altGivenName: '798798',
    altTelephone: 7899798,
    altFamilyName: '89798',
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
    bussinessNumber: 123123123,
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
    projectSchedule: 'SubmitButton.js',
    copiesOfRegistration: 'CheckboxesWidget.js',
    logicalNetworkDiagram: 'PasswordWidget.js',
    preparedFinancialStatements: 'EmailWidget.js',
    communityRuralDevelopmentBenefits: 'RadioWidget.js',
  },
  organizationLocation: {
    city: '123123',
    POBox: '123123',
    province: 'Manitoba',
    postalCode: '123123',
    streetName: '123123',
    unitNumber: '1231231',
    streetNumber: 123123,
    mailingAddress: {},
    isMailingAddress: 'No',
  },
  existingNetworkCoverage: {
    hasPassiveInfrastructure: true,
    isInfrastuctureAvailable: true,
    hasProvidedExitingNetworkCoverage:
      'I will provide existing network information and/or coverage to ISED by the application deadline',
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

const renderStaticLayout = () => {
  return render(
    <Review
      formData={mockFormData}
      formSchema={schema}
      reviewConfirm={true}
      onReviewConfirm={() => console.log('e')}
    />
  );
};

describe('The Review component', () => {
  it('should have correct sections', () => {
    renderStaticLayout();
    screen.getByRole('heading', { name: 'Project information' });
    screen.getByRole('heading', { name: 'Project area' });
    screen.getByRole('heading', { name: 'Existing network coverage' });
    screen.getByRole('heading', { name: 'Budget details' });
    screen.getByRole('heading', { name: 'Project funding' });
    screen.getByRole('heading', { name: 'Other funding sources' });
    screen.getByRole('heading', { name: 'Technological solution' });
    screen.getByRole('heading', { name: 'Benefits' });
    screen.getByRole('heading', { name: 'Project planning and management' });
    screen.getByRole('heading', { name: 'Estimated project employment' });
    screen.getByRole('heading', { name: 'Template uploads' });
    screen.getByRole('heading', { name: 'Supporting documents' });
    screen.getByRole('heading', { name: 'Mapping' });
    screen.getByRole('heading', { name: 'Organization Profile' });
    screen.getByRole('heading', { name: 'Organization location' });
    screen.getByRole('heading', { name: 'Organization contact information' });
  });
});
