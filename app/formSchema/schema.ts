import { useFeature } from '@growthbook/growthbook-react';
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

const useSchema = () => {
  // Check if development form is enabled in growthbook and pass to schema
  const formAlternateContact = useFeature('form-alternate-contact').value;
  const formAuthorizedContact = useFeature('form-authorized-contact').value;
  const formBudgetDetails = useFeature('form-budget-details').value;
  const formContactInformation = useFeature('form-contact-information').value;
  const formExistingNetworkCoverage = useFeature(
    'form-existing-network-coverage'
  ).value;
  const formOrganizationLocation = useFeature(
    'form-organization-location'
  ).value;
  const formOrganizationProfile = useFeature('form-organization-profile').value;
  const formProjectArea = useFeature('form-project-area').value;
  const formProjectInformation = useFeature('form-project-information').value;
  const formProjectFunding = useFeature('form-project-funding').value;

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
      ...(formProjectFunding && {
        ...projectFunding,
      }),
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
