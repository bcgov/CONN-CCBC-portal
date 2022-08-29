import {
  acknowledgements,
  alternateContact,
  authorizedContact,
  benefits,
  budgetDetails,
  contactInformation,
  estimatedProjectEmployment,
  existingNetworkCoverage,
  mapping,
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
  timeMashine,
  techSolution,
  templateUploads,
} from './pages';

const useSchema = (formData) => {
  const isEvidenceOfConnectivityRequired =
    formData?.templateUploads?.supportingConnectivityEvidence;

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
      ...timeMashine,
      ...templateUploads,
      ...supportingDocuments(isEvidenceOfConnectivityRequired),
      ...mapping,
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
