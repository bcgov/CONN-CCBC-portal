import {
  alternateContact,
  authorizedContact,
  budgetDetails,
  contactInformation,
  existingNetworkCoverage,
  organizationLocation,
  organizationProfile,
  projectArea,
  projectInformation,
  projectFunding,
} from './pages';

const useSchema = (featureFlagsForm: any) => {
  // featureFlagsForm is passed and enables development pages if set
  const {
    formAlternateContact,
    formAuthorizedContact,
    formBudgetDetails,
    formContactInformation,
    formExistingNetworkCoverage,
    formOrganizationLocation,
    formOrganizationProfile,
    formProjectArea,
    formProjectInformation,
  } = featureFlagsForm;

  const schema = {
    type: 'object',
    properties: {
      ...(formProjectInformation && {
        ...projectInformation,
      }),
      ...(formProjectArea && {
        ...projectArea,
      }),
      ...(formExistingNetworkCoverage && {
        ...existingNetworkCoverage,
      }),
      ...(formBudgetDetails && {
        ...budgetDetails,
      }),
      ...projectFunding,
      ...(formOrganizationProfile && {
        ...organizationProfile,
      }),
      ...(formOrganizationLocation && {
        ...organizationLocation,
      }),
      ...(formContactInformation && {
        ...contactInformation,
      }),
      ...(formAuthorizedContact && {
        ...authorizedContact,
      }),
      ...(formAlternateContact && {
        ...alternateContact,
      }),
    },
  };

  return schema;
};
export default useSchema;
