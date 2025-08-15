import projectTypeUiSchema from './projectTypeUiSchema';
import tombstoneUiSchema from './tombstoneUiSchema';
import locationsAndCountsUiSchema from './locationsAndCountsUiSchema';
import fundingUiSchema from './fundingUiSchema';
import eventsAndDatesUiSchema from './eventsAndDatesUiSchema';
import miscellaneousUiSchema from './miscellaneousUiSchema';
import projectDataReviewsUiSchema from './projectDataReviewsUiSchema';
import locationsUiSchema from './locationsUiSchema';

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
    'ui:options': { allowAnalystEdit: true },
  },
  projectType: {
    ...projectTypeUiSchema,
    'ui:options': { allowAnalystEdit: true },
  },
  locations: {
    ...locationsUiSchema,
    'ui:options': { allowAnalystEdit: true },
  },
  locationsAndCounts: {
    ...locationsAndCountsUiSchema,
    'ui:options': { allowAnalystEdit: true },
  },
  funding: {
    ...fundingUiSchema,
    'ui:options': { allowAnalystEdit: true },
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
    'ui:options': { allowAnalystEdit: true },
  },
  miscellaneous: {
    ...miscellaneousUiSchema,
    constructionCompletedOn: {
      ...miscellaneousUiSchema.constructionCompletedOn,
      'ui:widget': 'DateWidget',
    },
    'ui:options': { allowAnalystEdit: true },
  },
  projectDataReviews: {
    ...projectDataReviewsUiSchema,
    lastReviewed: {
      ...projectDataReviewsUiSchema.lastReviewed,
      'ui:widget': 'DateWidget',
    },
    locked: {
      ...projectDataReviewsUiSchema.locked,
      'ui:widget': 'RadioWidget',
    },
    'ui:options': { allowAnalystEdit: true },
  },
};

export default reviewUiSchema;
