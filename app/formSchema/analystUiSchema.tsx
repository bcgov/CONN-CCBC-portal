import { StyledH4, StyledTitleRow } from 'components/Review';
import styled from 'styled-components';
import {
  acknowledgements,
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
  review,
  submission,
  supportingDocuments,
  techSolution,
  templateUploads,
} from './uiSchema/pages';
import uiSchema from './uiSchema/uiSchema';

const StyledSubtitle = styled('h6')`
  padding: 16px !important;
  border-left: 0;
  font-weight: 600;
  margin: 0;
  font-size: 14px;
`;

const StyledTd = styled('td')`
  padding: 0;
`;

const reviewUiSchema = {
  ...uiSchema,
  'ui:submitButtonOptions': {
    norender: true,
  },
  projectInformation: {
    ...projectInformation,
    'ui:field': 'SectionField',
    'ui:options': {
      defaultExpanded: true,
    },
  },
  acknowledgements: {
    ...acknowledgements,
    'ui:field': 'SectionField',
    acknowledgementsList: {
      'ui:field': 'InlineArrayField',
    },
  },
  alternateContact: {
    ...alternateContact,
    'ui:field': 'SectionField',
  },
  authorizedContact: {
    ...authorizedContact,
    'ui:field': 'SectionField',
  },
  benefits: {
    ...benefits,
    'ui:field': 'SectionField',
  },
  budgetDetails: {
    ...budgetDetails,
    'ui:field': 'SectionField',
  },
  contactInformation: {
    ...contactInformation,
    'ui:field': 'SectionField',
  },
  coverage: {
    ...coverage,
    'ui:field': 'SectionField',
  },
  estimatedProjectEmployment: {
    ...estimatedProjectEmployment,
    'ui:field': 'SectionField',
    numberOfEmployeesToWork: {
      'ui:before': (
        <tr>
          <StyledTitleRow colSpan={2}>
            <StyledH4>Estimated direct employees</StyledH4>
          </StyledTitleRow>
        </tr>
      ),
    },
    numberOfContractorsToWork: {
      'ui:before': (
        <tr>
          <StyledTitleRow colSpan={2}>
            <StyledH4>Estimated contractor labour</StyledH4>
          </StyledTitleRow>
        </tr>
      ),
    },
  },
  existingNetworkCoverage: {
    ...existingNetworkCoverage,
    'ui:field': 'SectionField',
  },
  organizationLocation: {
    ...organizationLocation,
    'ui:field': 'SectionField',
    mailingAddress: {
      unitNumberMailing: {
        'ui:before': (
          <tr>
            <StyledTd colSpan={2}>
              <StyledSubtitle>Mailing address:</StyledSubtitle>
            </StyledTd>
          </tr>
        ),
      },
    },
  },
  organizationProfile: {
    ...organizationProfile,
    'ui:field': 'SectionField',
  },
  otherFundingSources: {
    ...otherFundingSources,
    'ui:field': 'SectionField',
    infrastructureBankFunding2223: {
      ...otherFundingSources.infrastructureBankFunding2223,
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
    otherFundingSourcesArray: {
      'ui:itemTitle': 'Funding source',
      items: {
        ...otherFundingSources.otherFundingSourcesArray.items,
        requestedFundingPartner2223: {
          ...otherFundingSources.otherFundingSourcesArray.items
            .requestedFundingPartner2223,
          'ui:before': (
            <tr>
              <StyledTd>
                <StyledSubtitle>Amount requested under source:</StyledSubtitle>
              </StyledTd>
            </tr>
          ),
        },
      },
    },
  },
  projectArea: {
    ...projectArea,
    'ui:field': 'SectionField',
    geographicArea: {
      'ui:field': 'InlineArrayField',
    },
    provincesTerritories: {
      'ui:field': 'InlineArrayField',
    },
  },
  projectFunding: {
    ...projectFunding,
    'ui:field': 'SectionField',
    fundingRequestedCCBC2223: {
      ...projectFunding.fundingRequestedCCBC2223,
      'ui:before': (
        <tr>
          <StyledTitleRow colSpan={2}>
            <StyledH4>Amount requested under CCBC</StyledH4>
          </StyledTitleRow>
        </tr>
      ),
    },
    applicationContribution2223: {
      ...projectFunding.applicationContribution2223,
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
    'ui:field': 'SectionField',
  },
  submission: {
    ...submission,
    'ui:field': 'SectionField',
    submissionCompletedFor: {
      'ui:widget': 'TextWidget',
    },
    submissionDate: {
      'ui:widget': 'TextWidget',
    },
  },
  supportingDocuments: {
    ...supportingDocuments,
    'ui:field': 'SectionField',
  },
  review: {
    ...review,
    'ui:field': 'SectionField',
  },
  techSolution: {
    ...techSolution,
    'ui:field': 'SectionField',
    backboneTechnology: {
      ...techSolution.backboneTechnology,
      'ui:field': 'InlineArrayField',
    },
    lastMileTechnology: {
      ...techSolution.backboneTechnology,
      'ui:field': 'InlineArrayField',
    },
  },
  templateUploads: {
    ...templateUploads,
    'ui:field': 'SectionField',
  },
};

export default reviewUiSchema;
