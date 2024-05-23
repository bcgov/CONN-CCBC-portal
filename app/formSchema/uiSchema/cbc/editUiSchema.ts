import projectTypeUiSchema from './projectTypeUiSchema';
import tombstoneUiSchema from './tombstoneUiSchema';
import locationsAndCountsUiSchema from './locationsAndCountsUiSchema';
import fundingUiSchema from './fundingUiSchema';

import eventsAndDatesUiSchema from './eventsAndDatesUiSchema';
import miscellaneousUiSchema from './miscellaneousUiSchema';
import projectDataReviewsUiSchema from './projectDataReviewsUiSchema';

const editUiSchema = {
  'ui:title': 'CBC Edit',
  tombstone: {
    'ui:title': 'Tombstone',
    ...tombstoneUiSchema,
  },
  projectType: {
    'ui:title': 'Project Type',
    ...projectTypeUiSchema,
  },
  locationsAndCounts: {
    'ui:title': 'Locations and Counts',
    ...locationsAndCountsUiSchema,
  },
  funding: {
    'ui:title': 'Funding',
    ...fundingUiSchema,
  },
  eventsAndDates: {
    'ui:title': 'Events and Dates',
    ...eventsAndDatesUiSchema,
  },
  miscellaneous: {
    'ui:title': 'Miscellaneous',
    ...miscellaneousUiSchema,
  },
  projectDataReviews: {
    'ui:title': 'Project Data Reviews',
    ...projectDataReviewsUiSchema,
  },
};

export default editUiSchema;
