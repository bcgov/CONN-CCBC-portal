import { JSONSchema7 } from 'json-schema';
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
} from './pages';

const schema: JSONSchema7 = {
  type: 'object',
  properties: {
    ...projectInformation,
    ...projectArea,
    ...existingNetworkCoverage,
    ...projectFunding,
    ...otherFundingSources,
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
