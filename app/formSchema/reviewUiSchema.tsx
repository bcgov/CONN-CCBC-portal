import { StyledH4, StyledTitleRow } from 'components/Review/Table';
import {
  alternateContact,
  authorizedContact,
  benefits,
  budgetDetails,
  projectInformation,
  contactInformation,
  coverage,
  estimatedProjectEmployment,
  existingNetworkCoverage,
  organizationLocation,
  organizationProfile,
  otherFundingSources,
  projectArea,
  projectFunding,
  projectPlan,
  supportingDocuments,
  techSolution,
  templateUploads,
} from './uiSchema/pages';
import uiSchema from './uiSchema/uiSchema';

const reviewUiSchema = {
  ...uiSchema,
  'ui:submitButtonOptions': {
    norender: true,
  },
  projectInformation: {
    ...projectInformation,
    'ui:field': 'ReviewSectionField',
    'ui:options': {
      defaultExpanded: true,
    },
  },
  acknowledgements: {
    'ui:field': 'HiddenField',
  },
  alternateContact: {
    ...alternateContact,
    'ui:field': 'ReviewSectionField',
  },
  authorizedContact: {
    ...authorizedContact,
    'ui:field': 'ReviewSectionField',
  },
  benefits: {
    ...benefits,
    'ui:field': 'ReviewSectionField',
  },
  budgetDetails: {
    ...budgetDetails,
    'ui:field': 'ReviewSectionField',
  },
  contactInformation: {
    ...contactInformation,
    'ui:field': 'ReviewSectionField',
  },
  coverage: {
    ...coverage,
    'ui:field': 'ReviewSectionField',
  },
  estimatedProjectEmployment: {
    ...estimatedProjectEmployment,
    'ui:field': 'ReviewSectionField',
  },
  existingNetworkCoverage: {
    ...existingNetworkCoverage,
    'ui:field': 'ReviewSectionField',
  },
  organizationLocation: {
    ...organizationLocation,
    'ui:field': 'ReviewSectionField',
  },
  organizationProfile: {
    ...organizationProfile,
    'ui:field': 'ReviewSectionField',
  },
  otherFundingSources: {
    ...otherFundingSources,
    'ui:field': 'ReviewSectionField',
    infrastructureBankFunding2223: {
      'ui:before': (
        <tr>
          <StyledTitleRow colSpan={2}>
            <StyledH4>
              Amount requested under Canadian Infrastructure Bank
            </StyledH4>
          </StyledTitleRow>
        </tr>
      ),
    },
  },
  projectArea: {
    ...projectArea,
    'ui:field': 'ReviewSectionField',
  },
  projectFunding: {
    ...projectFunding,
    'ui:field': 'ReviewSectionField',
    fundingRequestedCCBC2223: {
      'ui:before': (
        <tr>
          <StyledTitleRow colSpan={2}>
            <StyledH4>Amount requested under CCBC</StyledH4>
          </StyledTitleRow>
        </tr>
      ),
    },
    applicationContribution2223: {
      'ui:before': (
        <tr>
          <StyledTitleRow colSpan={2}>
            <StyledH4>Amount Applicant will contribute</StyledH4>
          </StyledTitleRow>
        </tr>
      ),
    },
  },
  projectPlan: {
    ...projectPlan,
    'ui:field': 'ReviewSectionField',
  },
  submission: { 'ui:field': 'HiddenField' },
  supportingDocuments: {
    ...supportingDocuments,
    'ui:field': 'ReviewSectionField',
  },
  review: {
    'ui:field': 'HiddenField',
  },
  techSolution: {
    ...techSolution,
    'ui:field': 'ReviewSectionField',
  },
  templateUploads: {
    ...templateUploads,
    'ui:field': 'ReviewSectionField',
  },
};

export default reviewUiSchema;
