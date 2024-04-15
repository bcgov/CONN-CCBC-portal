import { RJSFSchema } from '@rjsf/utils';
import {
  acknowledgements,
  alternateContact,
  authorizedContact,
  benefits,
  contactInformation,
  coverage,
  existingNetworkCoverage,
  organizationLocation,
  organizationProfile,
  otherFundingSourcesIntakeFour,
  projectAreaIntakeFour,
  projectInformation,
  projectFundingIntakeFour,
  projectPlan,
  submission,
  supportingDocuments,
  review,
  techSolution,
  templateUploads,
} from './pages';

const schema: RJSFSchema = {
  type: 'object',
  properties: {
    ...projectInformation,
    ...projectAreaIntakeFour,
    ...existingNetworkCoverage,
    ...projectFundingIntakeFour,
    ...otherFundingSourcesIntakeFour,
    ...techSolution,
    ...benefits,
    ...projectPlan,
    ...templateUploads,
    ...supportingDocuments,
    ...coverage,
    ...organizationProfile,
    ...organizationLocation,
    ...contactInformation,
    ...authorizedContact,
    ...alternateContact,
    ...review,
    ...acknowledgements,
    ...submission,
  },
};

export default schema;
