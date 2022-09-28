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
    'ui:widget': 'NumericStringWidget',
    'ui:options': {
      inputType: 'phone',
    },
  },
  contactExtension: {
    'ui:widget': 'NumericStringWidget',
  },
};

export default contactInformation;
