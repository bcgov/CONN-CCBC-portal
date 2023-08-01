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
    'ui:help': 'Maximum 150 characters',
    'ui:options': {
      maxLength: 150,
      hideErrors: true,
    },
  },
};

export default intakeUiSchema;
