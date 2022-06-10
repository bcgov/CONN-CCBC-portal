import {
  additionalProjectInformation,
  alternateContact,
  authorizedContact,
  budgetDetails,
  contactInformation,
  existingNetworkCoverage,
  organizationLocation,
  organizationProfile,
  projectInformation,
} from './pages';

const useSchema = (featureFlagsForm: any) => {
  // featureFlagsForm is passed and enables development pages if set
  const {
    formAdditionalProjectInformation,
    formAlternateContact,
    formAuthorizedContact,
    formBudgetDetails,
    formContactInformation,
    formExistingNetworkCoverage,
    formOrganizationLocation,
    formOrganizationProfile,
    formProjectInformation,
  } = featureFlagsForm;

  const schema = {
    type: 'object',
    properties: {
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
      ...(formExistingNetworkCoverage && {
        ...existingNetworkCoverage,
      }),
      ...(formProjectInformation && {
        ...projectInformation,
      }),
      ...(formAdditionalProjectInformation && {
        ...additionalProjectInformation,
      }),
      ...(formBudgetDetails && {
        ...budgetDetails,
      }),
    },
  };

  return schema;
};
export default useSchema;
