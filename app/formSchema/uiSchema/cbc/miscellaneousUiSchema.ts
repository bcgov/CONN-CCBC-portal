const miscellaneousUiSchema = {
  'ui:field': 'SectionField',
  'ui:options': {
    dividers: true,
  },
  'ui:title': 'Miscellaneous',
  projectMilestoneCompleted: {
    'ui:widget': 'NumberWidget',
    'ui:label': 'Project Milestone Completed',
  },
  constructionCompletedOn: {
    'ui:widget': 'DatePickerWidget',
    'ui:label': 'Construction Completed On',
  },
  milestoneComments: {
    'ui:widget': 'TextAreaWidget',
    'ui:label': 'Milestone Comments',
    'ui:options': {
      maxLength: 1000,
    },
  },
  primaryNewsRelease: {
    'ui:widget': 'TextWidget',
    'ui:label': 'Primary News Release',
  },
  secondaryNewsRelease: {
    'ui:widget': 'TextWidget',
    'ui:label': 'Secondary News Release',
  },
  notes: {
    'ui:widget': 'TextAreaWidget',
    'ui:label': 'Notes',
    'ui:options': {
      maxLength: 1000,
    },
  },
};

export default miscellaneousUiSchema;
