import { acknowledgements, review, submission } from './uiSchema/pages';
import reviewUiSchema from './reviewUiSchema';

const analystUiSchema = {
  ...reviewUiSchema,
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
