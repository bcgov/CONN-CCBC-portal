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
    dateApplicationReceived: {
      ...eventsAndDatesUiSchema.dateApplicationReceived,
      'ui:widget': 'DateWidget',
    },
    dateConditionallyApproved: {
      ...eventsAndDatesUiSchema.dateConditionallyApproved,
      'ui:widget': 'DateWidget',
    },
    dateAgreementSigned: {
      ...eventsAndDatesUiSchema.dateAgreementSigned,
      'ui:widget': 'DateWidget',
    },
    proposedStartDate: {
      ...eventsAndDatesUiSchema.proposedStartDate,
      'ui:widget': 'DateWidget',
    },
    proposedCompletionDate: {
      ...eventsAndDatesUiSchema.proposedCompletionDate,
      'ui:widget': 'DateWidget',
    },
    reportingCompletionDate: {
      ...eventsAndDatesUiSchema.reportingCompletionDate,
      'ui:widget': 'DateWidget',
    },
    dateAnnounced: {
      ...eventsAndDatesUiSchema.dateAnnounced,
      'ui:widget': 'DateWidget',
    },
  },
  miscellaneous: {
    ...miscellaneousUiSchema,
  },
  projectDataReviews: {
    ...projectDataReviewsUiSchema,
    lastReviewed: {
      ...projectDataReviewsUiSchema.lastReviewed,
      'ui:widget': 'DateWidget',
    },
  },
};

export default reviewUiSchema;
