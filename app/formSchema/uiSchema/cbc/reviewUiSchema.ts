import projectTypeUiSchema from './projectTypeUiSchema';
import tombstoneUiSchema from './tombstoneUiSchema';
import locationsAndCountsUiSchema from './locationsAndCountsUiSchema';
import fundingUiSchema from './fundingUiSchema';

import eventsAndDatesUiSchema from './eventsAndDatesUiSchema';
import miscellaneousUiSchema from './miscellaneousUiSchema';
import projectDataReviewsUiSchema from './projectDataReviewsUiSchema';

const reviewUiSchema = {
  tombstone: {
    ...tombstoneUiSchema,
    projectNumber: {
      'ui:widget': 'TextWidget',
    },
    phase: {
      'ui:widget': 'TextWidget',
    },
    intake: {
      'ui:widget': 'TextWidget',
    },
    projectStatus: {
      'ui:widget': 'TextWidget',
    },
    projectTitle: {
      'ui:widget': 'TextWidget',
    },
  },
  projectType: {
    ...projectTypeUiSchema,
  },
  locationsAndCounts: {
    ...locationsAndCountsUiSchema,
  },
  funding: {
    ...fundingUiSchema,
  },
  eventsAndDates: {
    ...eventsAndDatesUiSchema,
  },
  miscellaneous: {
    ...miscellaneousUiSchema,
  },
  projectDataReviews: {
    ...projectDataReviewsUiSchema,
  },
};

export default reviewUiSchema;
