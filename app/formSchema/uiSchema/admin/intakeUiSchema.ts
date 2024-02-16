const intakeUiSchema = {
  intakeNumber: {
    'ui:widget': 'ReadOnlyWidget',
    'ui:options': {
      hideErrors: true,
    },
  },
  startDate: {
    'ui:widget': 'DateTimePickerWidget',
  },
  endDate: {
    'ui:widget': 'DateTimePickerWidget',
  },
  description: {
    'ui:options': {
      maxLength: 150,
      hideErrors: true,
      showCharacterCount: true,
    },
  },
};

export default intakeUiSchema;
