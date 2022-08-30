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
} from './pages';

const useSchema = () => {
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
      ...estimatedProjectEmployment,
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

  return schema;
};
export default useSchema;
