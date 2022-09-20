const contactInformation = {
  'ui:order': [
    'contactTelephoneNumber',
    'contactExtension',
    'contactEmail',
    'contactWebsite',
  ],
  'ui:title': '',
  contactEmail: {
    'ui:options': {
      inputType: 'email',
    },
  },
  contactTelephoneNumber: {
    'ui:widget': 'NumberWidget',
    'ui:options': {
      inputType: 'phone',
    },
  },
  contactExtension: {
    'ui:widget': 'NumberWidget',
    'ui:options': {
      maxLength: 9,
      inputType: 'wholeNumber',
    },
  },
};

export default contactInformation;
