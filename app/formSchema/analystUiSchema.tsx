import { acknowledgements, review, submission } from './uiSchema/pages';
import reviewUiSchema from './reviewUiSchema';

const analystUiSchema = {
  ...reviewUiSchema,
  projectInformation: {
    ...reviewUiSchema.projectInformation,
    'ui:options': {
      allowAnalystEdit: true,
    },
  },
  projectArea: {
    ...reviewUiSchema.projectArea,
    'ui:options': {
      allowAnalystEdit: true,
    },
  },
  existingNetworkCoverage: {
    ...reviewUiSchema.existingNetworkCoverage,
    'ui:options': {
      allowAnalystEdit: true,
    },
  },
  budgetDetails: {
    ...reviewUiSchema.budgetDetails,
    'ui:options': {
      allowAnalystEdit: true,
    },
  },
  projectFunding: {
    ...reviewUiSchema.projectFunding,
    'ui:options': {
      allowAnalystEdit: true,
    },
  },
  otherFundingSources: {
    ...reviewUiSchema.otherFundingSources,
    'ui:options': {
      allowAnalystEdit: true,
    },
  },
  techSolution: {
    ...reviewUiSchema.techSolution,
    'ui:options': {
      allowAnalystEdit: true,
    },
  },
  benefits: {
    ...reviewUiSchema.benefits,
    'ui:options': {
      allowAnalystEdit: true,
    },
  },
  projectPlan: {
    ...reviewUiSchema.projectPlan,
    'ui:options': {
      allowAnalystEdit: true,
    },
  },
  estimatedProjectEmployment: {
    ...reviewUiSchema.estimatedProjectEmployment,
    'ui:options': {
      allowAnalystEdit: true,
    },
  },
  organizationProfile: {
    ...reviewUiSchema.organizationProfile,
    'ui:options': {
      allowAnalystEdit: true,
    },
  },
  organizationLocation: {
    ...reviewUiSchema.organizationLocation,
    'ui:options': {
      allowAnalystEdit: true,
    },
  },
  contactInformation: {
    ...reviewUiSchema.contactInformation,
    'ui:options': {
      allowAnalystEdit: true,
    },
  },
  authorizedContact: {
    ...reviewUiSchema.authorizedContact,
    'ui:options': {
      allowAnalystEdit: true,
    },
  },
  alternateContact: {
    ...reviewUiSchema.alternateContact,
    'ui:options': {
      allowAnalystEdit: true,
    },
  },
  acknowledgements: {
    ...acknowledgements,
    'ui:field': 'SectionField',
    acknowledgementsList: {
      'ui:field': 'ArrayBooleanField',
    },
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
  review: {
    ...review,
    'ui:field': 'SectionField',
    acknowledgeIncomplete: {
      'ui:field': 'ReviewCheckboxField',
    },
  },
};

export default analystUiSchema;
