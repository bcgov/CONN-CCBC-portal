import {
  formatRow,
  StyledColError,
  StyledColLeft,
  StyledColRight,
  StyledH4,
  StyledTable,
  StyledTitleRow,
} from 'components/Review/Table';
import { benefits } from './uiSchema/pages';

const reviewUiSchema = {
  'ui:submitButtonOptions': {
    norender: true,
  },
  projectInformation: {
    'ui:field': 'ReviewSectionField',
    'ui:options': {
      defaultExpanded: true,
    },
  },
  acknowledgements: {
    'ui:field': 'HiddenField',
  },
  alternateContact: {
    'ui:field': 'ReviewSectionField',
  },
  authorizedContact: {
    'ui:field': 'ReviewSectionField',
  },
  benefits: {
    ...benefits,
    'ui:field': 'ReviewSectionField',
  },
  budgetDetails: {
    'ui:field': 'ReviewSectionField',
  },
  contactInformation: {
    'ui:field': 'ReviewSectionField',
  },
  coverage: {
    'ui:field': 'ReviewSectionField',
  },
  estimatedProjectEmployment: {
    'ui:field': 'ReviewSectionField',
  },
  existingNetworkCoverage: {
    'ui:field': 'ReviewSectionField',
  },
  organizationLocation: {
    'ui:field': 'ReviewSectionField',
  },
  organizationProfile: {
    'ui:field': 'ReviewSectionField',
  },
  otherFundingSources: {
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
    'ui:field': 'ReviewSectionField',
  },
  projectFunding: {
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
    'ui:field': 'ReviewSectionField',
  },
  submission: { 'ui:field': 'HiddenField' },
  supportingDocuments: {
    'ui:field': 'ReviewSectionField',
  },
  review: {
    'ui:field': 'HiddenField',
  },
  techSolution: {
    'ui:field': 'ReviewSectionField',
  },
  templateUploads: {
    'ui:field': 'ReviewSectionField',
  },
};

export default reviewUiSchema;
