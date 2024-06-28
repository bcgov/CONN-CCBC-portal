const projectDataReviewsUiSchema = {
  'ui:field': 'SectionField',
  'ui:options': {
    dividers: true,
  },
  'ui:title': 'Project Data Reviews',
  locked: {
    'ui:widget': 'CheckboxWidget',
    'ui:label': 'Locked',
    'ui:title': '',
  },
  lastReviewed: {
    'ui:widget': 'DatePickerWidget',
    'ui:label': 'Last Reviewed',
  },
  reviewNotes: {
    'ui:widget': 'TextAreaWidget',
    'ui:label': 'Review Notes',
    'ui:options': {
      maxLength: 1000,
    },
  },
};
export default projectDataReviewsUiSchema;
