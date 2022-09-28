import { MAX_CONTACT_INPUT_LENGTH } from '../constants';

const authorizedContact = {
  'ui:order': [
    'authFamilyName',
    'authGivenName',
    'authPositionTitle',
    'authEmail',
    'authTelephone',
    'authExtension',
    'isAuthContactSigningOfficer',
  ],
  'ui:title': '',
  isAuthContactSigningOfficer: {
    'ui:widget': 'RadioWidget',
  },
  authFamilyName: {
    'ui:options': {
      maxLength: MAX_CONTACT_INPUT_LENGTH,
      altOptionalText: 'if applicable',
    },
  },
  authGivenName: {
    'ui:options': {
      maxLength: MAX_CONTACT_INPUT_LENGTH,
    },
  },
  authPositionTitle: {
    'ui:options': {
      maxLength: MAX_CONTACT_INPUT_LENGTH,
    },
  },
  authEmail: {
    'ui:options': {
      inputType: 'email',
      maxLength: MAX_CONTACT_INPUT_LENGTH,
    },
  },
  authTelephone: {
    'ui:widget': 'NumericStringWidget',
    'ui:options': {
      inputType: 'phone',
      'ui:title': '',
    },
  },
  authExtension: {
    'ui:widget': 'NumericStringWidget',
  },
};

export default authorizedContact;
