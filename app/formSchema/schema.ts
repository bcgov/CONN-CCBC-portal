import { useFeature } from '@growthbook/growthbook-react';
import {
  alternateContact,
  authorizedContact,
  benefits,
  budgetDetails,
  contactInformation,
  estimatedProjectEmployment,
  declarations,
  declarationsSign,
  existingNetworkCoverage,
  organizationLocation,
  organizationProfile,
  projectArea,
  projectInformation,
  projectFunding,
  projectPlan,
  techSolution,
} from './pages';

const useSchema = () => {
  // Check if development form is enabled in growthbook and pass to schema
  const formAlternateContact = useFeature('form-alternate-contact').value;
  const formAuthorizedContact = useFeature('form-authorized-contact').value;
  const formBenefits = useFeature('form-benefits').value;
  const formBudgetDetails = useFeature('form-budget-details').value;
  const formContactInformation = useFeature('form-contact-information').value;
  const formEstimatedProjectEmployment = useFeature(
    'form-estimated-project-employment'
  ).value;
  const formDeclarations = useFeature('form-declarations').value;
  const formDeclarationsSign = useFeature('form-declarations-sign').value;
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
  const formProjectPlan = useFeature('form-project-plan').value;
  const formTechSolution = useFeature('form-tech-solution').value;

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
      ...(formTechSolution && {
        ...techSolution,
      }),
      ...(formBenefits && {
        ...benefits,
      }),
      ...(formProjectPlan && {
        ...projectPlan,
      }),
      ...(formEstimatedProjectEmployment && {
        ...estimatedProjectEmployment,
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
      ...(formDeclarations && {
        ...declarations,
      }),
      ...(formDeclarationsSign && {
        ...declarationsSign,
      }),
    },
  };

  return schema;
};
export default useSchema;
