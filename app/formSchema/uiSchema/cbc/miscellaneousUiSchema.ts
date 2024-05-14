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
  },
  primaryNewsRelease: {
    'ui:widget': 'TextAreaWidget',
    'ui:label': 'Primary News Release',
  },
  secondaryNewsRelease: {
    'ui:widget': 'TextAreaWidget',
    'ui:label': 'Secondary News Release',
  },
  notes: {
    'ui:widget': 'TextAreaWidget',
    'ui:label': 'Notes',
  },
};

export default miscellaneousUiSchema;
