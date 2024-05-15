const pendingChangeRequestCommentUiSchema = {
  'ui:order': ['comment'],
  comment: {
    'ui:widget': 'TextAreaWidget',
    'ui:title': '',
    'ui:options': {
      boldTitle: true,
      maxLength: 100,
      showCharacterCount: true,
      label: false,
    },
  },
};

export default pendingChangeRequestCommentUiSchema;
