const historyFilterUiSchema = {
  types: {
    'ui:widget': 'MultiSelectWidget',
    'ui:options': {
      boldTitle: true,
    },
  },
  users: {
    'ui:widget': 'MultiSelectWidget',
    'ui:options': {
      boldTitle: true,
    },
  },
  'ui:inline': [
    {
      columns: 2,
      types: 1,
      users: 2,
    },
  ],
};

export default historyFilterUiSchema;
