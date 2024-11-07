const analystUiSchema = {
  givenName: {
    'ui:widget': 'TextWidget',
  },
  familyName: {
    'ui:widget': 'TextWidget',
  },
  email: {
    'ui:widget': 'TextWidget',
  },
  'ui:inline': [
    {
      columns: 3,
      givenName: 1,
      familyName: 2,
      email: 3,
    },
  ],
};

export default analystUiSchema;
