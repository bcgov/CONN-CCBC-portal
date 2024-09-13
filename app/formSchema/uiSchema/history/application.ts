/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable no-underscore-dangle */
import {
  acknowledgements,
  alternateContact,
  authorizedContact,
  benefits,
  budgetDetails,
  contactInformation,
  coverage,
  estimatedProjectEmployment,
  existingNetworkCoverage,
  organizationLocation,
  organizationProfile,
  otherFundingSources,
  projectArea,
  projectInformation,
  projectFunding,
  projectPlan,
  submission,
  supportingDocuments,
  review,
  techSolution,
  templateUploads,
} from 'formSchema/pages';

const amountRequestedUnderCCBC = {
  requiresHeading: true,
  heading: 'Amount requested under CCBC',
  headingKey: 'amountRequestedUnderCCBC',
};

const amountApplicantWillContribute = {
  requiresHeading: true,
  heading: 'Amount applicant will contribute',
  headingKey: 'amountApplicantWillContribute',
};

const amountRequestedUnderSource = {
  requiresHeading: true,
  heading: 'Amount requested under source',
  headingKey: 'amountRequestedUnderSource',
};

const amountRequestedUnderCIB = {
  requiresHeading: true,
  heading: 'Amount requested under Canadian Infrastructure Bank',
  headingKey: 'amountRequestedUnderCIB',
};

const estimatedDirectEmployees = {
  requiresHeading: true,
  heading: 'Estimated direct employees',
  headingKey: 'estimatedDirectEmployees',
  type: 'string',
};

const estimatedContractorLabour = {
  requiresHeading: true,
  heading: 'Estimated contractor labour',
  headingKey: 'estimatedContractorLabour',
  type: 'string',
};

const mailingAddress = {
  requiresHeading: true,
  heading: 'Mailing address',
  headingKey: 'mailingAddress',
};

const otherFundingSourcesArray = {
  requestedFundingPartner2223: {
    ...(otherFundingSources.otherFundingSources.dependencies
      .otherFundingSources['oneOf'][1]!.properties.otherFundingSourcesArray
      .items.properties.requestedFundingPartner2223 as Object),
    ...amountRequestedUnderSource,
  },
  requestedFundingPartner2324: {
    ...(otherFundingSources.otherFundingSources.dependencies
      .otherFundingSources['oneOf'][1]!.properties.otherFundingSourcesArray
      .items.properties.requestedFundingPartner2324 as Object),
    ...amountRequestedUnderSource,
  },
  requestedFundingPartner2425: {
    ...(otherFundingSources.otherFundingSources.dependencies
      .otherFundingSources['oneOf'][1]!.properties.otherFundingSourcesArray
      .items.properties.requestedFundingPartner2425 as Object),
    ...amountRequestedUnderSource,
  },
  requestedFundingPartner2526: {
    ...(otherFundingSources.otherFundingSources.dependencies
      .otherFundingSources['oneOf'][1]!.properties.otherFundingSourcesArray
      .items.properties.requestedFundingPartner2526 as Object),
    ...amountRequestedUnderSource,
  },
  requestedFundingPartner2627: {
    ...(otherFundingSources.otherFundingSources.dependencies
      .otherFundingSources['oneOf'][1]!.properties.otherFundingSourcesArray
      .items.properties.requestedFundingPartner2627 as Object),
    ...amountRequestedUnderSource,
  },
};

const applicationDiffSchema = {
  acknowledgements: { ...acknowledgements.acknowledgements },
  alternateContact: { ...alternateContact.alternateContact },
  authorizedContact: { ...authorizedContact.authorizedContact },
  benefits: {
    ...benefits.benefits,
    properties: {
      ...benefits.benefits.properties,
      numberOfHouseholds: {
        ...(benefits.benefits.properties.numberOfHouseholds as Object),
        type: 'string',
      },
      householdsImpactedIndigenous: {
        ...(benefits.benefits.properties
          .householdsImpactedIndigenous as Object),
        type: 'string',
      },
    },
  },
  budgetDetails: { ...budgetDetails.budgetDetails },
  projectInformation: { ...projectInformation.projectInformation },
  contactInformation: { ...contactInformation.contactInformation },
  coverage: { ...coverage.coverage },
  estimatedProjectEmployment: {
    ...estimatedProjectEmployment.estimatedProjectEmployment,
    properties: {
      ...estimatedProjectEmployment.estimatedProjectEmployment.properties,
      currentEmployment: {
        ...(estimatedProjectEmployment.estimatedProjectEmployment.properties
          .currentEmployment as Object),
        type: 'string',
      },
      numberOfEmployeesToWork: {
        ...(estimatedProjectEmployment.estimatedProjectEmployment.properties
          .numberOfEmployeesToWork as Object),
        ...estimatedDirectEmployees,
      },
      hoursOfEmploymentPerWeek: {
        ...(estimatedProjectEmployment.estimatedProjectEmployment.properties
          .hoursOfEmploymentPerWeek as Object),
        ...estimatedDirectEmployees,
      },
      personMonthsToBeCreated: {
        ...(estimatedProjectEmployment.estimatedProjectEmployment.properties
          .personMonthsToBeCreated as Object),
        ...estimatedDirectEmployees,
      },
      estimatedFTECreation: {
        ...(estimatedProjectEmployment.estimatedProjectEmployment.properties
          .estimatedFTECreation as Object),
        ...estimatedDirectEmployees,
        title:
          'Total estimated full-time equivalent (FTE) Job Creation (Direct)',
      },
      numberOfContractorsToWork: {
        ...(estimatedProjectEmployment.estimatedProjectEmployment.properties
          .numberOfContractorsToWork as Object),
        ...estimatedContractorLabour,
      },
      hoursOfContractorEmploymentPerWeek: {
        ...(estimatedProjectEmployment.estimatedProjectEmployment.properties
          .hoursOfContractorEmploymentPerWeek as Object),
        ...estimatedContractorLabour,
      },
      contractorPersonMonthsToBeCreated: {
        ...(estimatedProjectEmployment.estimatedProjectEmployment.properties
          .contractorPersonMonthsToBeCreated as Object),
        ...estimatedContractorLabour,
      },
      estimatedFTEContractorCreation: {
        ...(estimatedProjectEmployment.estimatedProjectEmployment.properties
          .estimatedFTEContractorCreation as Object),
        ...estimatedContractorLabour,
        title:
          'Total estimated full-time equivalent (FTE) Job Creation (Contractor)',
      },
    },
  },
  existingNetworkCoverage: {
    ...existingNetworkCoverage.existingNetworkCoverage,
  },
  organizationLocation: {
    ...organizationLocation.organizationLocation,
    properties: {
      ...organizationLocation.organizationLocation.properties,
      unitNumberMailing: {
        ...(organizationLocation.organizationLocation.dependencies
          .isMailingAddress['oneOf'][1]!.properties.mailingAddress.properties
          .unitNumberMailing as Object),
        ...mailingAddress,
      },
      streetNumberMailing: {
        ...(organizationLocation.organizationLocation.dependencies
          .isMailingAddress['oneOf'][1]!.properties.mailingAddress.properties
          .streetNumberMailing as Object),
        ...mailingAddress,
      },
      streetNameMailing: {
        ...(organizationLocation.organizationLocation.dependencies
          .isMailingAddress['oneOf'][1]!.properties.mailingAddress.properties
          .streetNameMailing as Object),
        ...mailingAddress,
      },
      POBoxMailing: {
        ...(organizationLocation.organizationLocation.dependencies
          .isMailingAddress['oneOf'][1]!.properties.mailingAddress.properties
          .POBoxMailing as Object),
        ...mailingAddress,
      },
      cityMailing: {
        ...(organizationLocation.organizationLocation.dependencies
          .isMailingAddress['oneOf'][1]!.properties.mailingAddress.properties
          .cityMailing as Object),
        ...mailingAddress,
      },
      provinceMailing: {
        ...(organizationLocation.organizationLocation.dependencies
          .isMailingAddress['oneOf'][1]!.properties.mailingAddress.properties
          .provinceMailing as Object),
        ...mailingAddress,
      },
      postalCodeMailing: {
        ...(organizationLocation.organizationLocation.dependencies
          .isMailingAddress['oneOf'][1]!.properties.mailingAddress.properties
          .postalCodeMailing as Object),
        ...mailingAddress,
      },
    },
  },
  organizationProfile: {
    ...organizationProfile.organizationProfile,
    properties: {
      ...organizationProfile.organizationProfile.dependencies
        .typeOfOrganization['oneOf'][1]!.properties,
      ...organizationProfile.organizationProfile.dependencies
        .typeOfOrganization['oneOf'][2]!.properties,
      ...organizationProfile.organizationProfile.dependencies.isNameLegalName[
        'oneOf'
      ][1]!.properties,
      ...organizationProfile.organizationProfile.dependencies.isSubsidiary[
        'oneOf'
      ][1]!.properties,
      ...organizationProfile.organizationProfile.dependencies
        .isIndigenousEntity['oneOf'][1]!.properties,
      ...organizationProfile.organizationProfile.properties,
      isIndigenousEntity: {
        title: 'Is this Applicant organization an Indigenous identity?',
      },
    },
  },
  otherFundingSources: {
    ...otherFundingSources.otherFundingSources,
    properties: {
      ...otherFundingSources.otherFundingSources.properties,
      ...otherFundingSources.otherFundingSources.dependencies
        .otherFundingSources['oneOf'][1]!.properties.otherFundingSourcesArray
        .items.properties,
      ...otherFundingSourcesArray,
      infrastructureBankFunding2223: {
        ...(otherFundingSources.otherFundingSources.properties
          .infrastructureBankFunding2223 as Object),
        ...amountRequestedUnderCIB,
      },
      infrastructureBankFunding2324: {
        ...(otherFundingSources.otherFundingSources.properties
          .infrastructureBankFunding2223 as Object),
        ...amountRequestedUnderCIB,
      },
      infrastructureBankFunding2425: {
        ...(otherFundingSources.otherFundingSources.properties
          .infrastructureBankFunding2223 as Object),
        ...amountRequestedUnderCIB,
      },
      infrastructureBankFunding2526: {
        ...(otherFundingSources.otherFundingSources.properties
          .infrastructureBankFunding2223 as Object),
        ...amountRequestedUnderCIB,
      },
      otherFundingSourcesArray: {
        requiresHeading: true,
        heading: 'Funding Source',
      },
    },
  },
  otherFundingSourcesArray: {
    properties: {
      ...otherFundingSources.otherFundingSources.dependencies
        .otherFundingSources['oneOf'][1]!.properties.otherFundingSourcesArray
        .items.properties,
      ...otherFundingSourcesArray,
    },
  },
  projectArea: {
    ...projectArea.projectArea,
    properties: {
      ...projectArea.projectArea.dependencies.projectSpanMultipleLocations[
        'oneOf'
      ][1]!.properties,
      ...projectArea.projectArea.properties,
    },
  },
  projectFunding: {
    ...projectFunding.projectFunding,
    properties: {
      ...projectFunding.projectFunding.properties,
      fundingRequestedCCBC2223: {
        ...(projectFunding.projectFunding.properties
          .fundingRequestedCCBC2223 as Object),
        ...amountRequestedUnderCCBC,
      },
      fundingRequestedCCBC2324: {
        ...(projectFunding.projectFunding.properties
          .fundingRequestedCCBC2324 as Object),
        ...amountRequestedUnderCCBC,
      },
      fundingRequestedCCBC2425: {
        ...(projectFunding.projectFunding.properties
          .fundingRequestedCCBC2425 as Object),
        ...amountRequestedUnderCCBC,
      },
      fundingRequestedCCBC2526: {
        ...(projectFunding.projectFunding.properties
          .fundingRequestedCCBC2526 as Object),
        ...amountRequestedUnderCCBC,
      },
      fundingRequestedCCBC2627: {
        ...(projectFunding.projectFunding.properties
          .fundingRequestedCCBC2627 as Object),
        ...amountRequestedUnderCCBC,
      },
      applicationContribution2223: {
        ...(projectFunding.projectFunding.properties
          .applicationContribution2223 as Object),
        ...amountApplicantWillContribute,
      },
      applicationContribution2324: {
        ...(projectFunding.projectFunding.properties
          .applicationContribution2324 as Object),
        ...amountApplicantWillContribute,
      },
      applicationContribution2425: {
        ...(projectFunding.projectFunding.properties
          .applicationContribution2425 as Object),
        ...amountApplicantWillContribute,
      },
      applicationContribution2526: {
        ...(projectFunding.projectFunding.properties
          .applicationContribution2526 as Object),
        ...amountApplicantWillContribute,
      },
      applicationContribution2627: {
        ...(projectFunding.projectFunding.properties
          .applicationContribution2627 as Object),
        ...amountApplicantWillContribute,
      },
      totalApplicantContribution: {
        ...(projectFunding.projectFunding.properties
          .totalApplicantContribution as Object),
        ...amountApplicantWillContribute,
      },
    },
  },
  projectPlan: { ...projectPlan.projectPlan },
  submission: { ...submission.submission },
  supportingDocuments: { ...supportingDocuments.supportingDocuments },
  review: { ...review.review },
  techSolution: { ...techSolution.techSolution },
  templateUploads: { ...templateUploads.templateUploads },
};

export default applicationDiffSchema;
