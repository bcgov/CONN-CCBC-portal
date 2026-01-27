const intakeUiSchema = {
  intakeNumber: {
    'ui:widget': 'ReadOnlyWidget',
    'ui:options': {
      hideErrors: true,
    },
  },
  zones: {
    'ui:widget': 'CheckboxesWidget',
    'ui:options': {
      checkboxDirection: 'column',
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
  rollingIntake: {
    'ui:widget': 'CheckboxWidget',
    'ui:options': {
      title: 'Is Rolling intake',
    },
  },
  inviteOnlyIntake: {
    'ui:widget': 'CheckboxWidget',
    'ui:options': {
      title: 'Invite only intake',
    },
  },
  allowUnlistedFnLedZones: {
    'ui:widget': 'CheckboxWidget',
    'ui:options': {
      title: 'Allow unlisted zones if FN based/led',
    },
  },
};

export default intakeUiSchema;
