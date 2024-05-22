const projectDataReviewsUiSchema = {
  'ui:field': 'SectionField',
  'ui:options': {
    dividers: true,
  },
  'ui:title': 'Project Data Reviews',
  locked: {
    'ui:widget': 'TextAreaWidget',
    'ui:label': 'Locked',
  },
  lastReviewed: {
    'ui:widget': 'DatePickerWidget',
    'ui:label': 'Last Reviewed',
  },
  reviewNotes: {
    'ui:widget': 'TextAreaWidget',
    'ui:label': 'Review Notes',
  },
};
export default projectDataReviewsUiSchema;
