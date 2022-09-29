import { MAX_CONTACT_INPUT_LENGTH } from '../constants';

const alternateContact = {
  'ui:order': [
    'altFamilyName',
    'altGivenName',
    'altPositionTitle',
    'altEmail',
    'altTelephone',
    'altExtension',
    'isAltContactSigningOfficer',
  ],
  'ui:title': '',
  altFamilyName: {
    'ui:options': {
      maxLength: MAX_CONTACT_INPUT_LENGTH,
      altOptionalText: 'if applicable',
    },
  },
  altGivenName: {
    'ui:options': {
      maxLength: MAX_CONTACT_INPUT_LENGTH,
    },
  },
  altPositionTitle: {
    'ui:options': {
      maxLength: MAX_CONTACT_INPUT_LENGTH,
    },
  },
  altEmail: {
    'ui:options': {
      inputType: 'email',
      maxLength: MAX_CONTACT_INPUT_LENGTH,
    },
  },
  altTelephone: {
    'ui:widget': 'NumericStringWidget',
    'ui:options': {
      inputType: 'phone',
    },
  },
  altExtension: {
    'ui:widget': 'NumericStringWidget',
  },
  isAltContactSigningOfficer: {
    'ui:widget': 'RadioWidget',
  },
};

export default alternateContact;
